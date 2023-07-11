const ms = require('ms');

const config = require('../config');

const today = () => new Date();

const tomorrow = () => new Date(Date.now() + 3600 * 1000 * 24);

const isToday = (someDate, todayDate = new Date()) => {
  const parsedDate = new Date(Date.parse(someDate));

  return (
    parsedDate.getTime() <= todayDate.getTime()
    || (parsedDate.getDate() === todayDate.getDate()
      && parsedDate.getMonth() === todayDate.getMonth()
      && parsedDate.getFullYear() === todayDate.getFullYear())
  );
};

const isTomorrow = (someDate, tomorrowDate = new Date(Date.now() + 3600 * 1000 * 24)) => {
  const parsedDate = new Date(Date.parse(someDate));

  return (
    parsedDate.getDate() === tomorrowDate.getDate()
    && parsedDate.getMonth() === tomorrowDate.getMonth()
    && parsedDate.getFullYear() === tomorrowDate.getFullYear()
  );
};

const todayAndTomorrow = () => {
  const dateNow = Date.now();

  return {
    today: new Date(dateNow),
    tomorrow: new Date(dateNow + 3600 * 1000 * 24),
  };
};

const isTodayOrTomorrow = (
  someDate,
  todayDate = new Date(),
  tomorrowDate = new Date(Date.now() + 3600 * 1000 * 24),
) => {
  const parsedDate = new Date(Date.parse(someDate));

  return (
    (parsedDate.getDate() === todayDate.getDate()
      && parsedDate.getMonth() === todayDate.getMonth()
      && parsedDate.getFullYear() === todayDate.getFullYear())
    || (parsedDate.getDate() === tomorrowDate.getDate()
      && parsedDate.getMonth() === tomorrowDate.getMonth()
      && parsedDate.getFullYear() === tomorrowDate.getFullYear())
  );
};

const getDayBasedMatches = (matches) => {
  const { today: todayDate, tomorrow: tomorrowDate } = todayAndTomorrow();

  return [
    {
      title: 'Today',
      data: matches.filter(({ startTime }) => isToday(startTime, todayDate)),
    },
    {
      title: 'Tomorrow',
      data: matches.filter(({ startTime }) => isTomorrow(startTime, tomorrowDate)),
    },
  ];
};

const getDateGroups = ({
  matches,
  includeFutures = false,
  futureFormat,
  maxSize = null,
  sortingRequired = true,
  version = null,
}) => {
  const { dateGroupsMinAppVersion } = config.getDynamicConfig();
  const futureDateFormat = {
    default: 'dd/mm/yyyy',
    ...futureFormat,
  };
  const sortedMatches = sortingRequired
    ? matches.sort((a, b) => new Date(a.displayTime) - new Date(b.displayTime))
    : matches;
  let groups;

  if (version > dateGroupsMinAppVersion) {
    groups = {
      today: 'Today',
      tomorrow: 'Tomorrow',
    };
    if (includeFutures) {
      groups.thisYear = futureDateFormat.thisYear || futureDateFormat.default;
      groups.nextYear = futureDateFormat.nextYear || futureDateFormat.default;
    }
  } else {
    groups = includeFutures ? ['Today', 'Tomorrow', futureDateFormat.default] : ['Today', 'Tomorrow'];
  }
  return {
    type: 'app.sports.timeGroups',
    groups,
    data: maxSize ? sortedMatches.slice(0, maxSize) : sortedMatches,
  };
};

const seconds = (timeStr) => ms(timeStr) / 1000;

const convertToISO = (date) => (date ? new Date(date).toISOString() : '');

module.exports = {
  todayAndTomorrow,
  isTodayOrTomorrow,
  today,
  tomorrow,
  isToday,
  isTomorrow,
  getDayBasedMatches,
  getDateGroups,
  seconds,
  convertToISO,
};
