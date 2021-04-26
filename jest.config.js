module.exports = {
  coverageReporters: ['json', 'text', 'html'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1'
  }
};