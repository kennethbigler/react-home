// colors
import cyan from '@material-ui/core/colors/cyan';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
// functions
import moment from 'moment';
import {// tech constants
  REACT,
  ANGULAR,
  JS,
  SASS,
  JASMINE,
  JAVA,
  AWS,
  PYTHON2,
  ASP2,
  CSHARP,
  SQL,
} from './tech';
// Parents: Main

const languageExp = [
  {
    color: red[900],
    company: JS,
    title: JS,
    short: 'JS',
    start: moment('2011-09'),
    end: moment(),
  }, {
    color: lightBlue[700],
    company: REACT,
    title: REACT,
    short: 'R.js',
    start: moment('2017-04'),
    end: moment(),
  }, {
    color: blue[800],
    company: ANGULAR,
    title: ANGULAR,
    short: 'A.js',
    start: moment('2014-09'),
    end: moment('2017-04'),
  }, {
    color: red[500],
    company: SASS,
    title: SASS,
    short: 'SASS',
    start: moment('2015-06'),
    end: moment(),
  }, {
    color: blue[500],
    company: JASMINE,
    title: JASMINE,
    short: 'J',
    start: moment('2018-03'),
    end: moment(),
  }, {
    color: lightBlue[700],
    company: JAVA,
    title: JAVA,
    short: 'Java',
    start: moment('2017-04'),
    end: moment('2018-03'),
  }, {
    color: cyan[900],
    company: 'AWS',
    title: AWS,
    short: 'AWS',
    start: moment('2016-10'),
    end: moment('2017-04'),
  }, {
    color: cyan[900],
    company: PYTHON2,
    title: PYTHON2,
    short: 'PY2',
    start: moment('2016-10'),
    end: moment('2017-04'),
  }, {
    color: red[500],
    company: ASP2,
    title: ASP2,
    short: 'ASP2',
    start: moment('2015-06'),
    end: moment('2016-06'),
  }, {
    color: red[500],
    company: CSHARP,
    title: CSHARP,
    short: CSHARP,
    start: moment('2015-06'),
    end: moment('2016-06'),
  }, {
    color: red[500],
    company: SQL,
    title: SQL,
    short: SQL,
    start: moment('2015-06'),
    end: moment('2016-06'),
  },
];

export default languageExp;
