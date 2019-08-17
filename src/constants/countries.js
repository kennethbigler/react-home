import forEach from 'lodash/forEach';
import {
  amber, blue, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow,
} from '@material-ui/core/colors/';

const countries = {
  Austria: { color: deepOrange[500], continent: 'EU' },
  Bahamas: { color: amber[500], continent: 'NA' },
  Canada: { color: blue[500], continent: 'NA' },
  Denmark: { color: deepPurple[500], continent: 'EU' },
  Estonia: { color: green[500], continent: 'EU' },
  Finland: { color: indigo[500], continent: 'EU' },
  France: { color: lightBlue[500], continent: 'EU' },
  Germany: { color: lightGreen[500], continent: 'EU' },
  Greece: { color: lime[500], continent: 'EU' },
  Iceland: { color: orange[500], continent: 'EU' },
  Ireland: { color: pink[500], continent: 'EU' },
  Italy: { color: purple[500], continent: 'EU' },
  Mexico: { color: brown[500], continent: 'NA' },
  Netherlands: { color: red[500], continent: 'EU' },
  Norway: { color: teal[500], continent: 'EU' },
  Poland: { color: yellow[500], continent: 'EU' },
  Portugal: { color: amber[800], continent: 'EU' },
  Russia: { color: blue[800], continent: 'EU' },
  Spain: { color: cyan[800], continent: 'EU' },
  Sweden: { color: deepOrange[800], continent: 'EU' },
  Switzerland: { color: deepPurple[800], continent: 'EU' },
  Turkey: { color: green[800], continent: 'EU' },
  'United Kingdom': { color: indigo[800], continent: 'EU' },
  'United States of America': { color: cyan[500], continent: 'NA' },
  'British Virgin Islands': { continent: 'NA' },
  'Cayman Islands': { continent: 'NA' },
  'U.S. Virgin Islands': { continent: 'NA' },
  Gibraltar: { continent: 'EU' },
  Malta: { continent: 'EU' },
  Monaco: { continent: 'EU' },
  Vatican: { continent: 'EU' },
};

export const NA = [];
export const EU = [];

forEach(countries, (country, name) => {
  country.continent === 'NA' && NA.push(name);
  country.continent === 'EU' && EU.push(name);
});

export default countries;
