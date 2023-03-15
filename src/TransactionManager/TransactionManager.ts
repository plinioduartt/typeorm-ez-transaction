import { DataSource } from 'typeorm'
import { InvalidDataSourceError } from './errors'
import { GenericDataSource, ITransactionManager } from './interfaces/ITransactionalManager'

export class TransactionManager implements ITransactionManager {
  public readonly dataSources: GenericDataSource[] = []
  private _defaultDataSource: GenericDataSource
  private static _instance: TransactionManager | undefined

  // private constructor() {}

  public addDataSource(
    dataSource: Exclude<GenericDataSource, undefined>
  ): Pick<ITransactionManager, 'addDataSource' | 'setDefaultDataSource'> {
    if (this.dataSources.map(item => item instanceof dataSource.constructor).length > 0) {
      return this
    }
    this.dataSources.push(dataSource)
    return this
  }

  public setDefaultDataSource(dataSource: Exclude<GenericDataSource, undefined>): void {
    const defaultDataSource: GenericDataSource | undefined = this.dataSources.find(
      item => item === dataSource
    )
    if (!defaultDataSource) {
      throw new InvalidDataSourceError(
        '[TransactionManager][setDefaultDataSource] Invalid or non-existent DataSource'
      )
    }
    this._defaultDataSource = defaultDataSource
  }

  get defaultDataSource(): GenericDataSource {
    return this._defaultDataSource
  }

  public static getInstance(): TransactionManager {
    if (!TransactionManager._instance) {
      TransactionManager._instance = new TransactionManager()
    }
    return TransactionManager._instance
  }

  public isTypeormDataSource(dataSource: GenericDataSource): dataSource is DataSource {
    return dataSource instanceof DataSource
  }
}