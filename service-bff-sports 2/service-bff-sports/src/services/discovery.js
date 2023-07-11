const ms = require('ms');
const newrelic = require('newrelic');

const config = require('../config');
const log = require('../log');
const request = require('../request');

let _links = null;

const run = async () => {
  log.info('starting discovery update');
  newrelic.startBackgroundTransaction('discovery update', async () => {
    const { discoveryService: { url, refreshInterval } } = config.get();
    try {
      (
        { _links } = await request.get(url)
      );
      log.info('finished discovery update');
    } catch (err) {
      log.error(err, 'error encountered in discovery update');
    } finally {
      setTimeout(run.bind(null), ms(refreshInterval));
    }
  });
};
run();

module.exports.get = (name) => ((_links || {})[name] || null);
