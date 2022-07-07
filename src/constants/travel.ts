import dateObj, { DateObj } from "../apis/DateHelper";

interface Country {
  continent: string;
  flag: string;
  code: string;
}
export type Countries = Record<string, Country>;

const countries: Countries = {
  Austria: { continent: "EU", flag: "🇦🇹", code: "at" },
  Bahamas: { continent: "NA", flag: "🇧🇸", code: "bs" },
  Canada: { continent: "NA", flag: "🇨🇦", code: "ca" },
  Denmark: { continent: "EU", flag: "🇩🇰", code: "dk" },
  Estonia: { continent: "EU", flag: "🇪🇪", code: "ee" },
  Finland: { continent: "EU", flag: "🇫🇮", code: "fi" },
  France: { continent: "EU", flag: "🇫🇷", code: "fr" },
  Germany: { continent: "EU", flag: "🇩🇪", code: "de" },
  Greece: { continent: "EU", flag: "🇬🇷", code: "gr" },
  Iceland: { continent: "EU", flag: "🇮🇸", code: "is" },
  Ireland: { continent: "EU", flag: "🇮🇪", code: "ie" },
  Italy: { continent: "EU", flag: "🇮🇹", code: "it" },
  Jamaica: { continent: "NA", flag: "🇯🇲", code: "jm" },
  Mexico: { continent: "NA", flag: "🇲🇽", code: "mx" },
  Netherlands: { continent: "EU", flag: "🇳🇱", code: "nl" },
  Norway: { continent: "EU", flag: "🇳🇴", code: "no" },
  Poland: { continent: "EU", flag: "🇵🇱", code: "pl" },
  Portugal: { continent: "EU", flag: "🇵🇹", code: "pt" },
  Russia: { continent: "EU", flag: "🇷🇺", code: "ru" },
  Spain: { continent: "EU", flag: "🇪🇸", code: "es" },
  Sweden: { continent: "EU", flag: "🇸🇪", code: "se" },
  Switzerland: { continent: "EU", flag: "🇨🇭", code: "ch" },
  Turkey: { continent: "EU", flag: "🇹🇷", code: "tr" },
  "United Kingdom": { continent: "EU", flag: "🇬🇧", code: "gb" },
  "United States of America": { continent: "NA", flag: "🇺🇸", code: "us" },
  "British Virgin Islands": { continent: "NA", flag: "🇻🇬", code: "vg" },
  "Cayman Islands": { continent: "NA", flag: "🇰🇾", code: "ky" },
  "U.S. Virgin Islands": { continent: "NA", flag: "🇻🇮", code: "vi" },
  Gibraltar: { continent: "EU", flag: "🇬🇮", code: "gi" },
  Malta: { continent: "EU", flag: "🇲🇹", code: "mt" },
  Monaco: { continent: "EU", flag: "🇲🇨", code: "mc" },
  Vatican: { continent: "EU", flag: "🇻🇦", code: "va" },
};

const ships = [
  "Disney Magic",
  "Disney Wonder",
  "Disney Dream",
  "Disney Fantasy",
  "Disney Wish",
] as const;
export type Ships = typeof ships[number];

interface Cruise {
  departure: DateObj;
  nights: number;
  name: string;
  ship: Ships;
  concierge: boolean;
}

export const cruises: Cruise[] = [
  {
    departure: dateObj("2004-04"),
    nights: 3,
    name: "Bahamas",
    ship: "Disney Wonder",
    concierge: false,
  },
  {
    departure: dateObj("2005-06"),
    nights: 7,
    name: "Mexican Riviera",
    ship: "Disney Magic",
    concierge: false,
  },
  {
    departure: dateObj("2011-06"),
    nights: 11,
    name: "Mediterranean",
    ship: "Disney Magic",
    concierge: true,
  },
  {
    departure: dateObj("2012-06"),
    nights: 7,
    name: "Alaska",
    ship: "Disney Wonder",
    concierge: false,
  },
  {
    departure: dateObj("2013-07"),
    nights: 12,
    name: "Mediterranean",
    ship: "Disney Magic",
    concierge: true,
  },
  {
    departure: dateObj("2014-07"),
    nights: 7,
    name: "Alaska",
    ship: "Disney Wonder",
    concierge: false,
  },
  {
    departure: dateObj("2015-07"),
    nights: 14,
    name: "Northern EU Capitals",
    ship: "Disney Magic",
    concierge: true,
  },
  {
    departure: dateObj("2015-08"),
    nights: 7,
    name: "Dover-Barcelona",
    ship: "Disney Magic",
    concierge: true,
  },
  {
    departure: dateObj("2015-12"),
    nights: 4,
    name: "Bahamas",
    ship: "Disney Dream",
    concierge: false,
  },
  {
    departure: dateObj("2016-06"),
    nights: 12,
    name: "Iceland/Norway",
    ship: "Disney Magic",
    concierge: false,
  },
  {
    departure: dateObj("2016-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: "Disney Fantasy",
    concierge: false,
  },
  {
    departure: dateObj("2017-05"),
    nights: 15,
    name: "East Bound Transatlantic",
    ship: "Disney Magic",
    concierge: false,
  },
  {
    departure: dateObj("2017-12"),
    nights: 7,
    name: "Western Caribbean",
    ship: "Disney Fantasy",
    concierge: false,
  },
  {
    departure: dateObj("2018-05"),
    nights: 13,
    name: "East Bound Transatlantic",
    ship: "Disney Magic",
    concierge: false,
  },
  {
    departure: dateObj("2018-07"),
    nights: 10,
    name: "Mediterranean",
    ship: "Disney Magic",
    concierge: false,
  },
  {
    departure: dateObj("2018-11"),
    nights: 7,
    name: "East Coast NY-FL-NY",
    ship: "Disney Magic",
    concierge: false,
  },
  {
    departure: dateObj("2019-09"),
    nights: 10,
    name: "West Bound Transatlantic",
    ship: "Disney Magic",
    concierge: true,
  },
  {
    departure: dateObj("2019-11"),
    nights: 7,
    name: "Western Caribbean",
    ship: "Disney Fantasy",
    concierge: true,
  },
  {
    departure: dateObj("2021-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: "Disney Fantasy",
    concierge: true,
  },
  {
    departure: dateObj("2022-04"),
    nights: 10,
    name: "Hawaii: Vancouver-Honolulu",
    ship: "Disney Wonder",
    concierge: true,
  },
];

export const NA: string[] = [];
export const EU: string[] = [];

Object.entries(countries).forEach(([name, country]): void => {
  country.continent === "NA" && NA.push(`${name} ${country.flag}`);
  country.continent === "EU" && EU.push(`${name} ${country.flag}`);
});

export default countries;
