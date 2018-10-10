// colors
import cyan from '@material-ui/core/colors/cyan';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
// functions
import moment from 'moment';
import {// tech constants
  REACT,
  ANGULAR,
  HTML,
  CSS,
  JS,
  SASS,
  MIXPANEL,
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
    color: yellow.A700,
    inverted: true,
    company: JS,
    title: JS,
    short: 'JS',
    start: moment('2011-09'),
    end: moment(),
  }, {
    color: orange[900],
    company: HTML,
    title: HTML,
    short: 'HTML',
    start: moment('2011-09'),
    end: moment(),
  }, {
    color: lightBlue[800],
    company: CSS,
    title: CSS,
    start: moment('2011-09'),
    end: moment(),
  }, {
    color: lightBlue[300],
    inverted: true,
    company: REACT,
    title: REACT,
    short: 'R.js',
    start: moment('2017-04'),
    end: moment(),
  }, {
    color: red[600],
    company: ANGULAR,
    title: ANGULAR,
    short: 'A.js',
    start: moment('2014-09'),
    end: moment('2017-04'),
  }, {
    color: purple.A200,
    company: SASS,
    title: SASS,
    short: 'SASS',
    start: moment('2015-06'),
    end: moment(),
  }, {
    color: indigo[900],
    company: MIXPANEL,
    title: MIXPANEL,
    short: 'MP',
    start: moment('2018-03'),
    end: moment(),
  }, {
    color: red[900],
    company: JAVA,
    title: JAVA,
    short: 'Java',
    start: moment('2017-04'),
    end: moment('2018-03'),
  }, {
    color: orange[500],
    company: AWS,
    title: AWS,
    short: 'AWS',
    start: moment('2016-10'),
    end: moment('2017-04'),
  }, {
    color: cyan[700],
    company: PYTHON2,
    title: PYTHON2,
    short: 'PY2',
    start: moment('2016-10'),
    end: moment('2017-04'),
  }, {
    color: purple[900],
    company: ASP2,
    title: ASP2,
    short: 'ASP2',
    start: moment('2015-06'),
    end: moment('2016-06'),
  }, {
    color: purple[400],
    company: CSHARP,
    title: CSHARP,
    short: CSHARP,
    start: moment('2015-06'),
    end: moment('2016-06'),
  }, {
    color: blue[800],
    company: SQL,
    title: SQL,
    short: SQL,
    start: moment('2015-06'),
    end: moment('2016-06'),
  },
];

export default languageExp;
