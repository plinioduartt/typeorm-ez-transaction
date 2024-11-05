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
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  globals: {
    'ts-jest': {
      compiler: 'ttypescript'
    }
  }
}

export default config
