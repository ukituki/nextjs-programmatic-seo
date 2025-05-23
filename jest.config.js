// jest.config.js
const nextJest = require('next/jest')({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // if you have a setup file
  testEnvironment: 'jest-environment-jsdom', // or 'node' if not testing DOM elements
  moduleNameMapper: {
    '^@/config$': '<rootDir>/src/config', // Adjust if your central config is elsewhere
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/interfaces$': '<rootDir>/src/interfaces', // Assuming index.ts in interfaces
    '^@/interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    // Add other aliases here if used in files being tested
  },
  preset: 'ts-jest', // Use ts-jest preset
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = nextJest(customJestConfig);
