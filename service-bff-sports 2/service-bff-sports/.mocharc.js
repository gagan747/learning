module.exports = {
  require: ['should', 'test/spec-helper'],
  recursive: true,
  exit: true,
  slow: 1000,
  timeout: 5000,
  reporter: 'mocha-multi-reporters',
  reporterOptions: ['configFile=.mocha-reporters.json'],
};
