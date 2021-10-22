import {
  amber, blue, brown, cyan,
  deepOrange, deepPurple, green, indigo,
  lightBlue, lightGreen, lime, orange,
  pink, purple, red, teal, yellow,
} from '@mui/material/colors/';

interface Country {
  color?: string;
  continent: string;
  flag: string;
}
export type Countries = Record<string, Country>;

const countries: Countries = {
  Austria: { color: deepOrange[500], continent: 'EU', flag: '🇦🇹' },
  Bahamas: { color: amber[500], continent: 'NA', flag: '🇧🇸' },
  Canada: { color: blue[500], continent: 'NA', flag: '🇨🇦' },
  Denmark: { color: deepPurple[500], continent: 'EU', flag: '🇩🇰' },
  Estonia: { color: green[500], continent: 'EU', flag: '🇪🇪' },
  Finland: { color: indigo[500], continent: 'EU', flag: '🇫🇮' },
  France: { color: lightBlue[500], continent: 'EU', flag: '🇫🇷' },
  Germany: { color: lightGreen[500], continent: 'EU', flag: '🇩🇪' },
  Greece: { color: lime[500], continent: 'EU', flag: '🇬🇷' },
  Iceland: { color: orange[500], continent: 'EU', flag: '🇮🇸' },
  Ireland: { color: pink[500], continent: 'EU', flag: '🇮🇪' },
  Italy: { color: purple[500], continent: 'EU', flag: '🇮🇹' },
  Jamaica: { color: lightBlue[800], continent: 'NA', flag: '🇯🇲' },
  Mexico: { color: brown[500], continent: 'NA', flag: '🇲🇽' },
  Netherlands: { color: red[500], continent: 'EU', flag: '🇳🇱' },
  Norway: { color: teal[500], continent: 'EU', flag: '🇳🇴' },
  Poland: { color: yellow[500], continent: 'EU', flag: '🇵🇱' },
  Portugal: { color: amber[800], continent: 'EU', flag: '🇵🇹' },
  Russia: { color: blue[800], continent: 'EU', flag: '🇷🇺' },
  Spain: { color: cyan[800], continent: 'EU', flag: '🇪🇸' },
  Sweden: { color: deepOrange[800], continent: 'EU', flag: '🇸🇪' },
  Switzerland: { color: deepPurple[800], continent: 'EU', flag: '🇨🇭' },
  Turkey: { color: green[800], continent: 'EU', flag: '🇹🇷' },
  'United Kingdom': { color: indigo[800], continent: 'EU', flag: '🇬🇧' },
  'United States of America': { color: cyan[500], continent: 'NA', flag: '🇺🇸' },
  'British Virgin Islands': { continent: 'NA', flag: '🇻🇬' },
  'Cayman Islands': { continent: 'NA', flag: '🇰🇾' },
  'U.S. Virgin Islands': { continent: 'NA', flag: '🇻🇮' },
  Gibraltar: { continent: 'EU', flag: '🇬🇮' },
  Malta: { continent: 'EU', flag: '🇲🇹' },
  Monaco: { continent: 'EU', flag: '🇲🇨' },
  Vatican: { continent: 'EU', flag: '🇻🇦' },
};

export const NA: string[] = [];
export const EU: string[] = [];

Object.entries(countries).forEach(([name, country]): void => {
  country.continent === 'NA' && NA.push(`${name} ${country.flag}`);
  country.continent === 'EU' && EU.push(`${name} ${country.flag}`);
});

export default countries;
