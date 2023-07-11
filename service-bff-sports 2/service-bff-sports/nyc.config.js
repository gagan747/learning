module.exports = {
  all: true,
  cache: false,
  include: ['src/**/*.js'],
  exclude: ['test/**/*'],
  reporter: ['text', 'text-summary', 'lcovonly'],
  'report-dir': 'output/coverage',
};