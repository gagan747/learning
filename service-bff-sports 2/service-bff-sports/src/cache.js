const ms = require('ms');

const cache = {};

const clearExpired = () => {
  const now = Date.now();

  Object.keys(cache).forEach((k) => {
    if (cache[k][0] < now) {
      delete cache[k];
    }
  });
};

const get = (key) => {
  const now = Date.now();
  const cacheEntry = cache[key];

  if (cacheEntry && now < cacheEntry[0]) {
    return JSON.parse(cacheEntry[1]);
  }

  return null;
};

const set = (key, data, timeToLive) => {
  const now = Date.now();
  let ttl = typeof timeToLive === 'function' ? timeToLive(data) : timeToLive;
  if (typeof ttl === 'string') {
    ttl = ms(ttl);
  }

  const expiry = now + (ttl || 0);
  if (expiry <= now) {
    return;
  }

  cache[key] = [expiry, JSON.stringify(data)];
};

module.exports = {
  clearExpired,
  get,
  set,
};
