import pino, { DestinationStream, Logger, LoggerOptions } from 'pino'
import pretty from 'pino-pretty'
import { TransactionManager } from 'src/Constants'
import { TransactionManagerException } from '../errors'
import { TypeormHandler } from '../handlers'
import {
  GenericDataSource,
  OrmHandlerOptions,
  TransactionalOptions
} from '../Interfaces'

/**
 * This decorator encapsulates all the method flow inside a transaction that commits in case of success and do rollback in failure cases
 * @param options Receives two optional parameters, dataSource and logging. If dataSource is not given, then it will use the default dataSource
 * @property logging Default = false
 * @returns
 */
export function Transactional(options?: TransactionalOptions): MethodDecorator {
  const logger: Logger<LoggerOptions | DestinationStream> = pino(
    {
      enabled: options?.logging ?? false
    },
    pretty({
      ignore: 'req,res,pid,hostname,sid,appname,instance,release,ns,headers'
    })
  )

  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    logger.info(
      `[${target.constructor.name as string
      }][${propertyKey.toString()}] is being intercepted by Transactional decorator...`
    )

    const originalMethod: any = descriptor.value
    descriptor.value = async function (...args: any) {
      const datasource: GenericDataSource = TransactionManager.datasource()

      if (!datasource) {
        throw new TransactionManagerException(
          `[${target.constructor.name as string
          }][${propertyKey.toString()}] Invalid or non-existent DataSource`
        )
      }

      const handlerOptions: OrmHandlerOptions = {
        dataSource: datasource,
        target,
        originalMethod,
        propertyKey,
        args,
        context: this,
        logger
      }

      if (TransactionManager.isValidTypeormDataSource(datasource)) {
        handlerOptions.dataSource = datasource
        const handler = new TypeormHandler()
        return await handler.handle(handlerOptions)
      }

      throw new TransactionManagerException(
        '[Transactional][ChooseHandler] Invalid or non-existent DataSource'
      )
    }
    return descriptor
  }
}
