module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.spec.ts'],

  moduleDirectories: ['node_modules', 'src'],

  moduleFileExtensions: ['ts', 'js', 'json'],

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/database/connection.ts', '!src/server.ts'],

  coverageDirectory: 'coverage',

  coverageReporters: ['text', 'lcov', 'html'],

  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],

  clearMocks: true,

  testTimeout: 10000,
};
