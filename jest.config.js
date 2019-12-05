module.exports = {
  automock: false,
  collectCoverage: false,
  collectCoverageFrom: [
    'src/utilities/**/*.ts',
    '!**/@declarations/**',
    '!**/@enums/**',
    '!**/@interfaces/**'
  ],
  globals: {
    'ts-jest': {
      babelConfig: '.babelrc',
      tsConfig: 'tsconfig.json',
      diagnostics: false
    }
  },
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [],
  testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js', '__tests__/data/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$'
};
