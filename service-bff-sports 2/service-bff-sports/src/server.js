const ApiServer = require('@tabdigital/api-server');

const pkg = require('../package.json');
const config = require('./config').get();
const log = require('./log');
const { formatRequestParams, enhanceReponseHeaders } = require('./middlewares');
const routes = require('./routes');

exports.createServer = () => {
  log.info(`Public Url: ${config.publicUrl}`);

  const server = new ApiServer({
    publicUrl: config.publicUrl,
    basePath: config.basePath,
    swagger: {
      title: pkg.name,
      version: pkg.version,
    },
    enableDiscovery: true,
    defaultCacheAge: 0,
    port: config.serverPort,
  });
  server.route(routes);
  server.restifyServer.use(formatRequestParams);
  server.restifyServer.use(enhanceReponseHeaders);
  return server;
};
