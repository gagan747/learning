const pipe = (...functions) => (input) => functions.reduce((x, f) => f(x), input);

const formatToTwoDecimalPlaces = (num) => parseFloat(num).toFixed(2);

module.exports = {
  pipe,
  formatToTwoDecimalPlaces,
};
