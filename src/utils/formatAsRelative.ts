// Array representing one minute, hour, day, week, month, etc. in seconds
const unitsInSec = [
  60,
  3600,
  86400,
  86400 * 7,
  86400 * 30,
  86400 * 365,
  Infinity,
];

const unitStrings: Intl.RelativeTimeFormatUnitSingular[] = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
];

const rtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  style: 'narrow',
});

export const formatAsRelative = (date: Date) => {
  const secondsDiff = Math.round((date.getTime() - Date.now()) / 1000);
  const unitIndex = unitsInSec.findIndex(
    (cutoff) => cutoff > Math.abs(secondsDiff)
  );
  const divisor = unitIndex ? unitsInSec[unitIndex - 1] : 1;

  return rtf.format(Math.floor(secondsDiff / divisor), unitStrings[unitIndex]);
};
