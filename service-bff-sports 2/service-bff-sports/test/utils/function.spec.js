const { pipe, formatToTwoDecimalPlaces } = require(`${global.SRC}/utils`);

describe('pipe', () => {
  it('should pipe functions in correct order', () => {
    const fun1 = (num) => num + 1;
    const fun2 = (num) => num * 2;
    const fun3 = (num) => num - 5;

    const result = pipe(fun1, fun2, fun3)(10);
    result.should.equal(17);
  });
});

describe('formatToTwoDecimalPlaces', () => {
  it('should format number to exactly two decimal places', () => {
    formatToTwoDecimalPlaces(2).should.equal('2.00');
    formatToTwoDecimalPlaces(2.1).should.equal('2.10');
    formatToTwoDecimalPlaces(2.119).should.equal('2.12');
  });
});
