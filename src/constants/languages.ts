import moment from 'moment';
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
    start: moment('2011-09'),
    end: moment(),
  }, {
    company: CSS,
    title: CSS,
    short: 'CSS',
    start: moment('2011-09'),
    end: moment(),
  }, {
    company: REACT,
    title: REACT,
    short: 'React',
    start: moment('2017-04'),
    end: moment(),
  }, {
    company: ANGULAR,
    title: ANGULAR,
    short: 'Angular',
    start: moment('2014-09'),
    end: moment('2017-04'),
  }, {
    company: SASS,
    title: SASS,
    short: 'SCSS',
    start: moment('2015-06'),
    end: moment(),
  }, {
    company: JASMINE,
    title: JASMINE,
    short: 'Jasmine',
    start: moment('2018-03'),
    end: moment(),
  }, {
    company: JAVA,
    title: JAVA,
    short: 'Java',
    start: moment('2017-04'),
    end: moment('2018-03'),
  }, {
    company: 'AWS',
    title: AWS,
    short: 'AWS',
    start: moment('2016-10'),
    end: moment('2017-04'),
  }, {
    company: PYTHON2,
    title: PYTHON2,
    short: 'PY2',
    start: moment('2016-10'),
    end: moment('2017-04'),
  }, {
    company: CSHARP,
    title: CSHARP,
    short: CSHARP,
    start: moment('2015-06'),
    end: moment('2016-06'),
  }, {
    company: SQL,
    title: SQL,
    short: SQL,
    start: moment('2015-06'),
    end: moment('2016-06'),
  },
];

export default languageExp;
