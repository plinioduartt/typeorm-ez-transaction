import { asyncLocalStorage, TypeormAsyncStorageKey } from 'src/Constants'
import { QueryRunner } from 'typeorm'
import { IOrmHandler, OrmHandlerOptions } from '../../src/Interfaces'

export class TypeormHandler implements IOrmHandler {
  async handle({
    dataSource,
    target,
    originalMethod,
    propertyKey,
    args,
    context,
    logger
  }: OrmHandlerOptions): Promise<unknown> {
    return await asyncLocalStorage.run(new Map(), async () => {
      const ctx = asyncLocalStorage.getStore()

      const manager: QueryRunner = dataSource.createQueryRunner()
      await manager.connect()
      await manager.startTransaction()

      ctx?.set(TypeormAsyncStorageKey, manager.manager)

      logger.info(
        `[typeorm-ez-transaction]:::[${
          target.constructor.name as string
        }]:::[${propertyKey.toString()}] transaction initialized.`
      )

      try {
        const result: unknown = await originalMethod.apply(context, args)
        await manager.commitTransaction()
        logger.info(
          `[typeorm-ez-transaction]:::[${
            target.constructor.name as string
          }]:::[${propertyKey.toString()}] transaction completed successfully.`
        )
        return result
      } catch (error: unknown) {
        logger.info(
          `[typeorm-ez-transaction]:::[${
            target.constructor.name as string
          }]:::[${propertyKey.toString()}] has failed. Rollback realized successfully.`
        )
        await manager.rollbackTransaction()
        throw error
      } finally {
        await manager.release()
      }
    })
  }
}
