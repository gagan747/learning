const name = process.env.APP_ENV || 'Dev';
exports.name = name;

process.env.CONFIG_PATH = `configs/${name}/config.json`;

process.env.NEW_RELIC_HOME = `/app/configs/${name}`;
