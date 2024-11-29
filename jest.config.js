/** @returns {Promise<import('jest').Config>} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.js'],
  verbose: true,
  forceExit: true,
};
