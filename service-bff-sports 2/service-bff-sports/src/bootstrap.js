// eslint-disable-next-line import/order
const env = require('./env');

const newrelic = require('newrelic');

const secrets = require('@tabdigital/secrets');

const log = require('./log');

secrets.load({
  service: 'service-bff-sports',
  env: env.name,
  skip: ['Dev', 'Test', 'ci', 'TAB-digitalCongo', 'digitalCongo'],
}).then(async () => {
  log.info(`Retrieved secrets for environment: ${env.name}`);
  // eslint-disable-next-line global-require
  require('./config').get();
  // eslint-disable-next-line global-require
  require('./start');
}).catch((e) => {
  log.error(e, `Error getting the secrets for  ${env.name}`);
  newrelic.noticeError(e);
});
