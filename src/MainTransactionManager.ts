import { AsyncLocalStorage } from 'async_hooks'
import { DataSource, EntityManager } from 'typeorm'
import { GenericDataSource, ITransactionManager } from './Interfaces'
import { TypeormAsyncStorageKey } from './Constants'
import { TransactionManagerException } from './errors'

export class MainTransactionManager implements ITransactionManager {
  private static _instance: MainTransactionManager | undefined
  private _defaultDataSource: GenericDataSource

  private constructor() {}

  public static instance(): MainTransactionManager {
    if (!MainTransactionManager._instance) {
      MainTransactionManager._instance = new MainTransactionManager()
    }
    return MainTransactionManager._instance
  }

  public setDatasource(ds: Exclude<GenericDataSource, undefined>): void {
    if (!this.isValidTypeormDataSource(ds)) {
      throw new TransactionManagerException(
        '[TransactionManager][setDatasource] Invalid or non-existent DataSource'
      )
    }
    this._defaultDataSource = ds
  }

  public datasource(): GenericDataSource {
    return this._defaultDataSource
  }

  public getManager(): EntityManager {
    const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>()
    const ctx = asyncLocalStorage?.getStore()
    return ctx?.get(TypeormAsyncStorageKey) as EntityManager
  }

  public isValidTypeormDataSource(
    dataSource: Exclude<GenericDataSource, undefined>
  ): dataSource is DataSource {
    return dataSource?.constructor?.name === DataSource.prototype?.constructor?.name
  }
}
