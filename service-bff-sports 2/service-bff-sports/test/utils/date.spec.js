const sinon = require('sinon');

const { isToday, isTomorrow, convertToISO } = require(`${global.SRC}/utils`);

const generateTests = (fn, expected, ...inputs) => describe(`${fn.name} returns ${expected}`, () => {
  inputs.forEach((input) => {
    it(`for ${input}`, () => {
      fn(input).should.eql(expected);
    });
  });
});

afterEach(() => {
  sinon.restore();
});

describe('Given the date is 2022-03-09T02:00:00.000Z', () => {
  beforeEach(() => {
    sinon.useFakeTimers(Date.parse('2022-03-09T02:00:00.000Z'));
  });

  generateTests(
    isToday,
    true,
    '2022-03-09T01:00:00.000Z',
    '2022-03-09T02:00:00.000Z',
    '2022-03-09T03:00:00.000Z',
    '2022-03-09T13:59:59.999Z',
  );

  generateTests(
    isToday,
    false,
    '2022-03-09T14:00:00.000Z',
    '2022-03-10T11:00:00.000Z',
    '2022-03-10T12:00:00.000Z',
    '2022-03-10T13:00:00.000Z',
  );

  generateTests(
    isTomorrow,
    true,
    '2022-03-09T14:00:00.000Z',
    '2022-03-10T11:00:00.000Z',
    '2022-03-10T12:00:00.000Z',
    '2022-03-10T13:00:00.000Z',
  );

  generateTests(
    isTomorrow,
    false,
    '2022-03-09T01:00:00.000Z',
    '2022-03-09T03:00:00.000Z',
    '2022-03-09T13:59:59.999Z',
    '2022-03-10T14:00:00.000Z',
    '2022-03-11T01:00:00.000Z',
    '2022-03-11T03:00:00.000Z',
  );

  generateTests(
    convertToISO,
    '2023-06-01T01:50:00.000Z',
    '2023-06-01T07:20:00.000+05:30',
  );

  generateTests(
    convertToISO,
    '',
    undefined,
  );
});
