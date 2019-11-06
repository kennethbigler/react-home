const months = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
];

export type DateScale = 'years' | 'months' | 'days' | undefined;
export type FormatOutput = 'YYYY' | 'MMMM Y' | '\'YY';
export interface DateObj {
  year: number;
  month: number;
  day: number;
  diff: Function;
  format: Function;
}

/** Takes format YYYY-MM-DD and creates a DateObj */
const dateHelper = (date?: DateObj | string): DateObj => {
  let year: number;
  let month: number;
  let day: number;

  if (typeof date === 'object') {
    return date;
  }
  if (typeof date === 'string') {
    const [y, m, d] = date.split('-');
    year = parseInt(y, 10);
    month = parseInt(m, 10) || 1;
    day = parseInt(d, 10) || 1;
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth();
    day = now.getDate();
  }

  const diff = (dateObj: DateObj, scale: DateScale): number => {
    switch (scale) {
      case 'years':
        return year - dateObj.year;
      case 'months':
        return (12 * year + month) - (12 * dateObj.year + dateObj.month);
      default:
        return (365 * year + 30 * (month + 1) + day) - (365 * dateObj.year + 30 * (dateObj.month + 1) + dateObj.day);
    }
  };

  const format = (output: FormatOutput): string => {
    switch (output) {
      case 'YYYY':
        return year.toString();
      case 'MMMM Y':
        return `${months[month]} ${year}`;
      case '\'YY':
        return `'${year.toString().slice(-2)}`;
      default:
        // eslint-disable-next-line no-console
        console.error('unknown date format: ', output);
        return '';
    }
  };

  return {
    year,
    month,
    day,
    diff,
    format,
  };
};

export default dateHelper;
