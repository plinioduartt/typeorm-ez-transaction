import { DataSource } from 'typeorm'
import { SupportedOrms, GenericDataSource, ITransactionManager } from './Interfaces'
import { MainTransactionManager } from './MainTransactionManager'

/**
 * All the supported ORMs DataSources
 */
export const SupportedDataSources = {
  /**
   * The key and the prototype identification for TypeOrm implementation
   */
  typeorm: DataSource.prototype
} satisfies Record<SupportedOrms, Exclude<GenericDataSource, undefined>>

/**
 * Shortcut to TransactionManager.getInstance()
 */
export const TransactionManager: ITransactionManager = MainTransactionManager.instance()

export const TypeormAsyncStorageKey = 'typeorm-ez-transaction_manager'
