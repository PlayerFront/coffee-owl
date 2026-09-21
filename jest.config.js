module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    "^swiper/react$": "<rootDir>/src/__mocks__/swiperReactMock.js",
    "^swiper/modules$": "<rootDir>/src/__mocks__/swiperModulesMock.js",
    "^swiper/css$": "<rootDir>/src/__mocks__/styleMock.js",
    "^swiper/css/pagination$": "<rootDir>/src/__mocks__/styleMock.js",
  },

  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js'
  ],


  testPathIgnorePatterns: ['/node_modules/', '/build/'],


  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};