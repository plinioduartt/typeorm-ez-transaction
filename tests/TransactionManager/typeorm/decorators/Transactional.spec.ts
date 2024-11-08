/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata'
import { createMock } from 'ts-auto-mock'
import { DataSource, DataSourceOptions } from 'typeorm'
import { OrmHandlerOptions, Transactional, TransactionalOptions } from '../../../../src'
import { TypeormHandler } from '../../../../src/handlers'
import { MainTransactionManager } from '../../../../src/MainTransactionManager'
jest.mock('typeorm', () => {
  const mockClass: jest.MockedClass<any> = jest.fn((...args) => {
    const instance = Object.create(DataSource.prototype)

    return Object.assign(instance, { args })
  })

  return {
    DataSource: mockClass
  }
})

describe('Transactional decorator with typeorm data source', () => {
  const spyTypeormHandler: jest.SpyInstance<
  Promise<unknown>,
  [OrmHandlerOptions],
  any
  > = jest.spyOn(TypeormHandler.prototype, 'handle')
  const transactionManager: MainTransactionManager = MainTransactionManager.instance()
  const mockedOptions: DataSourceOptions = createMock<DataSourceOptions>()
  const mockedTypeormDataSource: DataSource = new DataSource(mockedOptions)
  transactionManager.setDatasource(mockedTypeormDataSource)
  const expectedResult = 'test'

  afterEach(() => {
    jest.clearAllMocks()
  })

  const optionsCases: TransactionalOptions[] = [
    undefined as unknown as TransactionalOptions,
    {} as unknown as TransactionalOptions,
    { logging: true } as unknown as TransactionalOptions
  ]

  test.each(optionsCases)(
    'Test decorator with different options',
    async (options: TransactionalOptions) => {
      // arrange
      class MockedTestingClass {
        @Transactional(options)
        async methodToTest(): Promise<string> {
          return expectedResult
        }
      }
      const testingClass: MockedTestingClass = new MockedTestingClass()
      spyTypeormHandler.mockResolvedValue(expectedResult)

      // act
      const result: string = await testingClass.methodToTest()

      // assert
      expect(spyTypeormHandler).toBeCalledTimes(1)
      expect(spyTypeormHandler).toBeCalledWith(
        expect.objectContaining({
          dataSource: mockedTypeormDataSource,
          target: MockedTestingClass.prototype,
          originalMethod: expect.any(Function),
          propertyKey: 'methodToTest',
          args: expect.any(Array),
          context: expect.any(Object),
          logger: expect.any(Object)
        })
      )
      expect(result).toBe(expectedResult)
    }
  )
})
