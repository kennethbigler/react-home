import {
  amber,
  blue,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors/";
import dateObj, { DateObj } from "../apis/DateHelper";

const colors = [
  amber[500],
  blue[500],
  brown[500],
  cyan[500],
  deepOrange[500],
  deepPurple[500],
  green[500],
  indigo[500],
  lightBlue[500],
  lightGreen[500],
  lime[500],
  orange[500],
  pink[500],
  purple[500],
  red[500],
  teal[500],
  yellow[500],
];

interface Country {
  continent: string;
  flag: string;
  code: string;
  color?: string;
}
export type Countries = Record<string, Country>;

const countries: Countries = {
  // Australia: { continent: "AU", flag: "🇦🇺", code: "au" },
  Austria: { continent: "EU", flag: "🇦🇹", code: "at" },
  Bahamas: { continent: "NA", flag: "🇧🇸", code: "bs" },
  "British Virgin Islands": { continent: "NA", flag: "🇻🇬", code: "vg" },
  Canada: { continent: "NA", flag: "🇨🇦", code: "ca" },
  "Cayman Islands": { continent: "NA", flag: "🇰🇾", code: "ky" },
  // China: { continent: "AS", flag: "🇨🇳", code: "cn" },
  Denmark: { continent: "EU", flag: "🇩🇰", code: "dk" },
  // Egypt: { continent: "AF", flag: "🇪🇬", code: "eg" },
  Estonia: { continent: "EU", flag: "🇪🇪", code: "ee" },
  Finland: { continent: "EU", flag: "🇫🇮", code: "fi" },
  France: { continent: "EU", flag: "🇫🇷", code: "fr" },
  Germany: { continent: "EU", flag: "🇩🇪", code: "de" },
  Gibraltar: { continent: "EU", flag: "🇬🇮", code: "gi" },
  Greece: { continent: "EU", flag: "🇬🇷", code: "gr" },
  // "Hong Kong": { continent: "AS", flag: "🇭🇰", code: "hk" },
  Iceland: { continent: "EU", flag: "🇮🇸", code: "is" },
  // India: { continent: "AS", flag: "🇮🇳", code: "in" },
  Ireland: { continent: "EU", flag: "🇮🇪", code: "ie" },
  Italy: { continent: "EU", flag: "🇮🇹", code: "it" },
  Jamaica: { continent: "NA", flag: "🇯🇲", code: "jm" },
  // Japan: { continent: "AS", flag: "🇯🇵", code: "jp" },
  Malta: { continent: "EU", flag: "🇲🇹", code: "mt" },
  Mexico: { continent: "NA", flag: "🇲🇽", code: "mx" },
  Monaco: { continent: "EU", flag: "🇲🇨", code: "mc" },
  Netherlands: { continent: "EU", flag: "🇳🇱", code: "nl" },
  Norway: { continent: "EU", flag: "🇳🇴", code: "no" },
  Poland: { continent: "EU", flag: "🇵🇱", code: "pl" },
  Portugal: { continent: "EU", flag: "🇵🇹", code: "pt" },
  Russia: { continent: "EU", flag: "🇷🇺", code: "ru" },
  Spain: { continent: "EU", flag: "🇪🇸", code: "es" },
  Sweden: { continent: "EU", flag: "🇸🇪", code: "se" },
  Switzerland: { continent: "EU", flag: "🇨🇭", code: "ch" },
  Turkey: { continent: "EU", flag: "🇹🇷", code: "tr" },
  // "United Arab Emirates": { continent: "AF", flag: "🇦🇪", code: "ae" },
  "United Kingdom": { continent: "EU", flag: "🇬🇧", code: "gb" },
  "United States of America": { continent: "NA", flag: "🇺🇸", code: "us" },
  "U.S. Virgin Islands": { continent: "NA", flag: "🇻🇮", code: "vi" },
  Vatican: { continent: "EU", flag: "🇻🇦", code: "va" },
};

Object.keys(countries).forEach((country, i) => {
  countries[country].color = colors[i % colors.length];
});

export const rcLoyalty = [
  { nights: 3, status: "Gold" },
  { nights: 30, status: "Platinum" },
  { nights: 55, status: "Emerald" },
  { nights: 80, status: "Diamond" },
  { nights: 175, status: "Diamond Plus" },
  { nights: 700, status: "Pinnacle Club" },
];

export const lines = ["Disney", "Royal Caribbean"] as const;
export type Lines = typeof lines[number];

export const ships = [
  "Magic",
  "Wonder",
  "Dream",
  "Fantasy",
  "Wish",
  "Navigator of the Seas",
] as const;
export type Ships = typeof ships[number];

interface Cruise {
  departure: DateObj;
  nights: number;
  name: string;
  ship: Ships;
  line: Lines;
  concierge: boolean;
}

export const cruises: Cruise[] = [
  {
    departure: dateObj("2004-04"),
    nights: 3,
    name: "Bahamas",
    ship: "Wonder",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2005-06"),
    nights: 7,
    name: "Mexican Riviera",
    ship: "Magic",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2011-06"),
    nights: 11,
    name: "Mediterranean",
    ship: "Magic",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2012-06"),
    nights: 7,
    name: "Alaska",
    ship: "Wonder",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2013-07"),
    nights: 12,
    name: "Mediterranean",
    ship: "Magic",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2014-07"),
    nights: 7,
    name: "Alaska",
    ship: "Wonder",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2015-07"),
    nights: 14,
    name: "Northern EU Capitals",
    ship: "Magic",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2015-08"),
    nights: 7,
    name: "Dover-Barcelona",
    ship: "Magic",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2015-12"),
    nights: 4,
    name: "Bahamas",
    ship: "Dream",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2016-06"),
    nights: 12,
    name: "Iceland/Norway",
    ship: "Magic",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2016-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: "Fantasy",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2017-05"),
    nights: 15,
    name: "East Bound Transatlantic",
    ship: "Magic",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2017-12"),
    nights: 7,
    name: "Western Caribbean",
    ship: "Fantasy",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2018-05"),
    nights: 13,
    name: "East Bound Transatlantic",
    ship: "Magic",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2018-07"),
    nights: 10,
    name: "Mediterranean",
    ship: "Magic",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2018-11"),
    nights: 7,
    name: "East Coast NY-FL-NY",
    ship: "Magic",
    line: "Disney",
    concierge: false,
  },
  {
    departure: dateObj("2019-09"),
    nights: 10,
    name: "West Bound Transatlantic",
    ship: "Magic",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2019-11"),
    nights: 7,
    name: "Western Caribbean",
    ship: "Fantasy",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2021-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: "Fantasy",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2022-04"),
    nights: 10,
    name: "Hawaii: Vancouver-Honolulu",
    ship: "Wonder",
    line: "Disney",
    concierge: true,
  },
  {
    departure: dateObj("2022-08"),
    nights: 4,
    name: "Catalina & Ensenada",
    ship: "Navigator of the Seas",
    line: "Royal Caribbean",
    concierge: false,
  },
  // {
  //   departure: dateObj("2022-12"),
  //   nights: 3,
  //   name: "Bahamas",
  //   ship: "Wish",
  //   line: "Disney",
  //   concierge: false,
  // },
  // {
  //   departure: dateObj("2022-12"),
  //   nights: 4,
  //   name: "Bahamas",
  //   ship: "Wish",
  //   line: "Disney",
  //   concierge: true,
  // },
  // {
  //   departure: dateObj("2023-05"),
  //   nights: 4,
  //   name: "Eastbound Transatlantic",
  //   ship: "Dream",
  //   line: "Disney",
  //   concierge: true,
  // },
];

export const americas: string[] = [];
export const euNaf: string[] = [];
export const asNau: string[] = [];

Object.entries(countries).forEach(([name, country]): void => {
  switch (country.continent) {
    case "NA":
      americas.push(`${name} ${country.flag}`);
      break;
    case "EU":
    case "AF":
      euNaf.push(`${name} ${country.flag}`);
      break;
    case "AS":
    case "AU":
    default:
      asNau.push(`${name} ${country.flag}`);
  }
});

export default countries;
