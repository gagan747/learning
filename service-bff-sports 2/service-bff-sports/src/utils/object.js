const isDeeplyEmpty = (obj) => {
  if (obj === undefined || obj === null) {
    return true;
  }

  return typeof obj === 'object' && Object.values(obj).every(isDeeplyEmpty);
};

module.exports = {
  isDeeplyEmpty,
};
