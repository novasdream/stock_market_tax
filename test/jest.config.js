const path = require('path')

module.exports = {
  roots: [path.join(__dirname, '../src')],
  rootDir: path.join(__dirname, '..'),
  testMatch: ['**/__tests__/**'],
  testEnvironment: 'node',
  moduleDirectories: [
    'node_modules',
    __dirname,
    path.join(__dirname, '../src'),
  ],
  coverageDirectory: path.join(__dirname, '../coverage/collective'),
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['.*/__tests__/.*'],
}