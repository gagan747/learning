const pkg = require('../package.json');
const cache = require('./cache');
const launchDarkly = require('./launch-darkly');
const log = require('./log');
const scheduler = require('./scheduler');
const server = require('./server');

const cacheClearInterval = 3600000; // milliseconds

const start = async () => {
  try {
    const app = server.createServer();
    await app.start();
    log.info(`${pkg.name} listening at ${app.url}`);
    scheduler.start();
    launchDarkly.run();
    setInterval(
      () => {
        cache.clearExpired();
        log.info('cleared cache');
      },
      cacheClearInterval,
    );
  } catch (e) {
    log.error(e, 'Error starting server');
    process.exit(1);
  }
};

start();
