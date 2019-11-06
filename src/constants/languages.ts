import dateObj from '../apis/DateHelper';
import {
  ANGULAR, AWS, CSHARP, CSS,
  JASMINE, JAVA, JS, PYTHON2,
  REACT, SASS, SQL,
} from './tech';

const languageExp = [
  {
    company: JS,
    title: JS,
    short: 'JS',
    start: dateObj('2011-09'),
    end: dateObj(),
  }, {
    company: CSS,
    title: CSS,
    short: 'CSS',
    start: dateObj('2011-09'),
    end: dateObj(),
  }, {
    company: REACT,
    title: REACT,
    short: 'React',
    start: dateObj('2017-04'),
    end: dateObj(),
  }, {
    company: ANGULAR,
    title: ANGULAR,
    short: 'Angular',
    start: dateObj('2014-09'),
    end: dateObj('2017-04'),
  }, {
    company: SASS,
    title: SASS,
    short: 'SCSS',
    start: dateObj('2015-06'),
    end: dateObj(),
  }, {
    company: JASMINE,
    title: JASMINE,
    short: 'Jasmine',
    start: dateObj('2018-03'),
    end: dateObj(),
  }, {
    company: JAVA,
    title: JAVA,
    short: 'Java',
    start: dateObj('2017-04'),
    end: dateObj('2018-03'),
  }, {
    company: 'AWS',
    title: AWS,
    short: 'AWS',
    start: dateObj('2016-10'),
    end: dateObj('2017-04'),
  }, {
    company: PYTHON2,
    title: PYTHON2,
    short: 'PY2',
    start: dateObj('2016-10'),
    end: dateObj('2017-04'),
  }, {
    company: CSHARP,
    title: CSHARP,
    short: CSHARP,
    start: dateObj('2015-06'),
    end: dateObj('2016-06'),
  }, {
    company: SQL,
    title: SQL,
    short: SQL,
    start: dateObj('2015-06'),
    end: dateObj('2016-06'),
  },
];

export default languageExp;
