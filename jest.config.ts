import { type Config } from '@jest/types'

const config: Config.InitialOptions = {
  roots: ['<rootDir>/tests'],
  bail: 0,
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [],
  verbose: true,
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  transform: {
    '.*\\.ts$': 'ts-jest'
  },
  testMatch: ['**/?(*.)+(spec|test).[t]s?(x)'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  globals: {
    'ts-jest': {
      compiler: 'ttypescript'
    }
  }
}

export default config
