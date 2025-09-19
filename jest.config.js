module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/migrations/**',
      '!src/seeders/**',
      '!src/tests/**',
      '!src/config/database.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    testTimeout: 30000,
    verbose: true
  };