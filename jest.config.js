module.exports = {
    testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
    // Настройки для coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js'
  ],
  
  // Игнорируем папки
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  
  // setup файл
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};