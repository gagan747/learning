const ms = require('ms');
const newrelic = require('newrelic');
const util = require('util');

const Scheduler = require('@tabdigital/scheduler');

const config = require('./config');
const log = require('./log');

const scheduler = new Scheduler(newrelic);

// Log error
scheduler.on('jobError', (err, jobOpts) => log.error(err, jobOpts, 'Error while updating dynamic config job'));

const start = () => {
  const conf = config.get().dynamicConfigService;

  if (conf.enabled && conf.url && conf.refreshInterval) {
    scheduler.schedule(
      {
        interval: ms(conf.refreshInterval),
        newrelicTransactionName: 'dynamic-config:fetch',
      },
      util.callbackify(config.fetchDynamicConfig.bind(config, conf.url)),
    );
  }
};

module.exports = { start };
