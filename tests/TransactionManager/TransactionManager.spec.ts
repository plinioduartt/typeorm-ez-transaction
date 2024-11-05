import 'reflect-metadata'
import { TransactionManager } from 'src'
import { TransactionManagerException } from 'src/errors'
import { createMock } from 'ts-auto-mock'
import { DataSource, DataSourceOptions } from 'typeorm'
jest.mock('typeorm', () => {
  const mockClass: jest.MockedClass<any> = jest.fn((...args: any) => {
    const instance = Object.create(DataSource.prototype)

    return Object.assign(instance, { args })
  })

  return {
    DataSource: mockClass
  }
})

describe('MainTransactionManager', () => {
  const mockedTypeormDataSource = createMock<DataSource>()

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Set default data source', () => {
    // arrange
    const sut = TransactionManager
    const spySetDefaultDataSource = jest.spyOn(sut, 'setDatasource')
    jest.spyOn(sut, 'isValidTypeormDataSource').mockReturnValueOnce(true)

    // act
    sut.setDatasource(mockedTypeormDataSource)

    // assert
    expect(sut.datasource()).not.toBeNull()
    expect(spySetDefaultDataSource).toHaveBeenCalledTimes(1)
  })

  test('Set default data source with invalid data source', () => {
    // arrange
    const sut = TransactionManager
    const spySetDefaultDataSource = jest.spyOn(sut, 'setDatasource')
    const mockedInvalidDataSource: any = createMock<any>()

    // act
    const action = (): void => sut.setDatasource(mockedInvalidDataSource)

    // assert
    expect(() => action()).toThrow(
      new TransactionManagerException(
        '[TransactionManager][setDatasource] Invalid or non-existent DataSource'
      )
    )
    expect(spySetDefaultDataSource).toBeCalledTimes(1)
  })

  test('Get default data source', () => {
    // arrange
    const sut = TransactionManager
    jest.spyOn(sut, 'isValidTypeormDataSource').mockReturnValueOnce(true)
    sut.setDatasource(mockedTypeormDataSource)

    // act
    const defaultDataSource = sut.datasource()

    // assert
    expect(defaultDataSource).toBe(mockedTypeormDataSource)
  })

  test('Validate isTypeormDataSource polymorphism', () => {
    // arrange
    const sut = TransactionManager
    const mockedOptions = createMock<DataSourceOptions>()
    const mockedDataSource: DataSource = new DataSource(mockedOptions)

    // act
    const isCorrectDataSourceSource: boolean = sut.isValidTypeormDataSource(mockedDataSource)

    // assert
    expect(isCorrectDataSourceSource).toBeTruthy()
  })

  test('Validate singleton', () => {
    // arrange
    const instanceOne = TransactionManager
    const instanceTwo = TransactionManager
    jest.spyOn(instanceOne, 'isValidTypeormDataSource').mockReturnValueOnce(true)

    // act
    instanceOne.setDatasource(mockedTypeormDataSource)

    // assert
    expect(instanceTwo.datasource).not.toBeNull()
  })
})
