import { blue, cyan, indigo, red, yellow } from "@mui/material/colors";
import dateObj, { DateObj } from "../apis/DateHelper";

interface Country {
  name: string;
  continent: string;
  flag: string;
}

/** name is a unique key, verify it on https://unpkg.com/world-atlas@2.0.2/countries-110m.json */
const countries: Country[] = [
  { name: "American Samoa", continent: "AS", flag: "🇦🇸" },
  { name: "Australia", continent: "AU", flag: "🇦🇺" },
  { name: "Austria", continent: "EU", flag: "🇦🇹" },
  { name: "Bahamas", continent: "NA", flag: "🇧🇸" },
  { name: "British Virgin Islands", continent: "NA", flag: "🇻🇬" },
  { name: "Canada", continent: "NA", flag: "🇨🇦" },
  { name: "Cayman Islands", continent: "NA", flag: "🇰🇾" },
  { name: "China", continent: "AS", flag: "🇨🇳" },
  { name: "Denmark", continent: "EU", flag: "🇩🇰" },
  { name: "Egypt", continent: "AF", flag: "🇪🇬" },
  { name: "Estonia", continent: "EU", flag: "🇪🇪" },
  { name: "Fiji", continent: "AS", flag: "🇫🇯" },
  { name: "Finland", continent: "EU", flag: "🇫🇮" },
  { name: "France", continent: "EU", flag: "🇫🇷" },
  { name: "Germany", continent: "EU", flag: "🇩🇪" },
  { name: "Gibraltar", continent: "EU", flag: "🇬🇮" },
  { name: "Greece", continent: "EU", flag: "🇬🇷" },
  { name: "Hong Kong", continent: "AS", flag: "🇭🇰" },
  { name: "Iceland", continent: "EU", flag: "🇮🇸" },
  { name: "India", continent: "AS", flag: "🇮🇳" },
  { name: "Ireland", continent: "EU", flag: "🇮🇪" },
  { name: "Italy", continent: "EU", flag: "🇮🇹" },
  { name: "Jamaica", continent: "NA", flag: "🇯🇲" },
  { name: "Japan", continent: "AS", flag: "🇯🇵" },
  { name: "Malta", continent: "EU", flag: "🇲🇹" },
  { name: "Mexico", continent: "NA", flag: "🇲🇽" },
  { name: "Monaco", continent: "EU", flag: "🇲🇨" },
  { name: "Netherlands", continent: "EU", flag: "🇳🇱" },
  { name: "New Caledonia", continent: "AS", flag: "🇳🇨" },
  { name: "Norway", continent: "EU", flag: "🇳🇴" },
  { name: "Poland", continent: "EU", flag: "🇵🇱" },
  { name: "Portugal", continent: "EU", flag: "🇵🇹" },
  { name: "Russia", continent: "EU", flag: "🇷🇺" },
  { name: "Spain", continent: "EU", flag: "🇪🇸" },
  { name: "Sweden", continent: "EU", flag: "🇸🇪" },
  { name: "Switzerland", continent: "EU", flag: "🇨🇭" },
  { name: "Turkey", continent: "EU", flag: "🇹🇷" },
  { name: "United Arab Emirates", continent: "AF", flag: "🇦🇪" },
  { name: "United Kingdom", continent: "EU", flag: "🇬🇧" },
  { name: "United States of America", continent: "NA", flag: "🇺🇸" },
  { name: "U.S. Virgin Islands", continent: "NA", flag: "🇻🇮" },
  { name: "Vatican", continent: "EU", flag: "🇻🇦" },
];

export const disneyLoyalty = [
  { num: 1, status: "Silver" },
  { num: 5, status: "Gold" },
  { num: 10, status: "Platinum" },
  { num: 25, status: "Pearl" },
];

export const rcLoyalty = [
  { nights: 3, status: "Gold" },
  { nights: 30, status: "Platinum" },
  { nights: 55, status: "Emerald" },
  { nights: 80, status: "Diamond" },
  { nights: 175, status: "Diamond Plus" },
  { nights: 700, status: "Pinnacle Club" },
];

export const princessLoyalty = [
  { num: 1, nights: 1, status: "Gold" },
  { num: 3, nights: 30, status: "Ruby" },
  { num: 5, nights: 50, status: "Platinum" },
  { num: 15, nights: 150, status: "Elite" },
];

export const virginLoyalty = [
  { num: 1, status: "Sailing Club" },
  { num: 2, status: "Blue Extras" },
  { num: 4, status: "Deep Blue Extras" },
];

export const lines = [
  "Disney",
  "Royal Caribbean",
  "Princess",
  "Virgin Voyages",
] as const;
export type Lines = (typeof lines)[number];

export const ships = [
  "Magic",
  "Wonder",
  "Dream",
  "Fantasy",
  "Wish",
  "Treasure",
  "Navigator of the Seas",
  "Discovery",
  "Resilient Lady",
] as const;
export type Ships = (typeof ships)[number];

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
    ship: ships[1],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2005-06"),
    nights: 7,
    name: "Mexican Riviera",
    ship: ships[0],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2011-06"),
    nights: 11,
    name: "Mediterranean",
    ship: ships[0],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2012-06"),
    nights: 7,
    name: "Alaska",
    ship: ships[1],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2013-07"),
    nights: 12,
    name: "Mediterranean",
    ship: ships[0],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2014-07"),
    nights: 7,
    name: "Alaska",
    ship: ships[1],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2015-07"),
    nights: 14,
    name: "Northern EU Capitals",
    ship: ships[0],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2015-08"),
    nights: 7,
    name: "Dover-Barcelona",
    ship: ships[0],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2015-12"),
    nights: 4,
    name: "Bahamas",
    ship: ships[2],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2016-06"),
    nights: 12,
    name: "Iceland/Norway",
    ship: ships[0],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2016-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: ships[3],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2017-05"),
    nights: 15,
    name: "East Bound Transatlantic",
    ship: ships[0],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2017-12"),
    nights: 7,
    name: "Western Caribbean",
    ship: ships[3],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2018-05"),
    nights: 13,
    name: "East Bound Transatlantic",
    ship: ships[0],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2018-07"),
    nights: 10,
    name: "Mediterranean",
    ship: ships[0],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2018-11"),
    nights: 7,
    name: "East Coast NY-FL-NY",
    ship: ships[0],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2019-09"),
    nights: 10,
    name: "West Bound Transatlantic",
    ship: ships[0],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2019-11"),
    nights: 7,
    name: "Western Caribbean",
    ship: ships[3],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2021-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: ships[3],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2022-04"),
    nights: 10,
    name: "Hawaii: Vancouver-Honolulu",
    ship: ships[1],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2022-08"),
    nights: 4,
    name: "Catalina & Ensenada",
    ship: ships[6],
    line: lines[1],
    concierge: false,
  },
  {
    departure: dateObj("2022-12"),
    nights: 4,
    name: "Bahamas",
    ship: ships[4],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2022-12"),
    nights: 3,
    name: "Bahamas",
    ship: ships[4],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2023-02"),
    nights: 4,
    name: "San Diego & Ensenada",
    ship: ships[7],
    line: lines[2],
    concierge: false,
  },
  {
    departure: dateObj("2023-05"),
    nights: 3,
    name: "Bahamas",
    ship: ships[2],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2023-05"),
    nights: 13,
    name: "Eastbound Transatlantic",
    ship: ships[2],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2024-03"),
    nights: 15,
    name: "Sydney to Honolulu",
    ship: ships[1],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2024-05"),
    nights: 3,
    name: "Bahamas",
    ship: ships[4],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2024-09"),
    nights: 10,
    name: "Vancouver to Honolulu",
    ship: ships[1],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2024-12"),
    nights: 4,
    name: "Bahamas",
    ship: ships[3],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2024-12"),
    nights: 7,
    name: "Maiden Voyage (Caribbean)",
    ship: ships[5],
    line: lines[0],
    concierge: true,
  },
  {
    departure: dateObj("2025-02"),
    nights: 7,
    name: "Saint Isles & Caribbean",
    ship: ships[8],
    line: lines[3],
    concierge: true,
  },
  {
    departure: dateObj("2026-04"),
    nights: 14,
    name: "Panama Canal",
    ship: ships[0],
    line: lines[0],
    concierge: true,
  },
];

const numDisney = [0, 0, 0, 0, 0, 0];
const numRC = [0];
const numPrincess = [0];
const numVirgin = [0];

cruises.forEach((cruise) => {
  switch (cruise.ship) {
    case ships[0]:
      numDisney[0] += 1;
      return;
    case ships[1]:
      numDisney[1] += 1;
      return;
    case ships[2]:
      numDisney[2] += 1;
      return;
    case ships[3]:
      numDisney[3] += 1;
      return;
    case ships[4]:
      numDisney[4] += 1;
      return;
    case ships[5]:
      numDisney[5] += 1;
      return;
    case ships[6]:
      numRC[0] += 1;
      return;
    case ships[7]:
      numPrincess[0] += 1;
      return;
    default:
      numVirgin[0] += 1;
  }
});

const totalDisney = numDisney.reduce((acc, num) => acc + num, 0);

export const cruiseData = {
  nodes: [
    { id: "🛳", color: yellow[900] },
    // lines
    { id: lines[0], color: cyan[400] },
    { id: lines[1], color: indigo[900] },
    { id: lines[2], color: blue[500] },
    { id: lines[3], color: red[900] },
    // ships
    { id: ships[0], color: indigo[900] },
    { id: ships[1], color: "white" },
    { id: ships[2], color: yellow[600] },
    { id: ships[3], color: "white" },
    { id: ships[4], color: red[600] },
    { id: ships[5], color: "black" },
    { id: "Navigator", color: yellow[600] },
    { id: ships[7], color: "white" },
    { id: ships[8], color: "black" },
  ],
  data: [
    // level 1
    ["🛳", lines[0], totalDisney],
    ["🛳", lines[1], numRC[0]],
    ["🛳", lines[2], numPrincess[0]],
    ["🛳", lines[3], numVirgin[0]],
    // level 2
    [lines[0], ships[0], numDisney[0]], // Magic
    [lines[0], ships[1], numDisney[1]], // Wonder
    [lines[0], ships[2], numDisney[2]], // Dream
    [lines[0], ships[3], numDisney[3]], // Fantasy
    [lines[0], ships[4], numDisney[4]], // Wish
    [lines[0], ships[5], numDisney[5]], // Treasure
    [lines[1], "Navigator", numRC[0]], // Navigator
    [lines[2], ships[7], numPrincess[0]], // Discovery
    [lines[3], ships[8], numVirgin[0]], // Resilient Lady
  ],
};

export const americas: Country[] = [];
export const euNaf: Country[] = [];
export const asNau: Country[] = [];

countries.forEach((country): void => {
  switch (country.continent) {
    case "NA":
      americas.push(country);
      break;
    case "EU":
    case "AF":
      euNaf.push(country);
      break;
    case "AS":
    case "AU":
    default:
      asNau.push(country);
  }
});

export const numCountries = countries.length;

export default countries;
