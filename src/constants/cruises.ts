import {
  blue,
  cyan,
  indigo,
  red,
  yellow,
  amber,
  grey,
  blueGrey,
} from "@mui/material/colors";
import { SeriesOptionsType } from "highcharts";
import dateObj, { DateObj } from "../apis/DateHelper";

const lines = [
  "Disney",
  "Royal Caribbean",
  "Princess",
  "Virgin Voyages",
] as const;
type Lines = (typeof lines)[number];

const ships = [
  "Magic",
  "Wonder",
  "Dream",
  "Fantasy",
  "Wish",
  "Treasure",
  "Navigator of the Seas",
  "Discovery",
  "Scarlet Lady",
] as const;
type Ships = (typeof ships)[number];

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
    departure: dateObj("2025-03"),
    nights: 7,
    name: "Galveston to San Juan",
    ship: ships[0],
    line: lines[0],
    concierge: false,
  },
  {
    departure: dateObj("2025-05"),
    nights: 15,
    name: "Miami to Casablanca & Barcelona",
    ship: ships[8],
    line: lines[3],
    concierge: false,
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

// -------------------------     Loyalty     ------------------------- //

const disneyLoyalty = [
  { num: 1, status: "Silver" },
  { num: 5, status: "Gold" },
  { num: 10, status: "Platinum" },
  { num: 25, status: "Pearl" },
];

const rcLoyalty = [
  { nights: 3, status: "Gold" },
  { nights: 30, status: "Platinum" },
  { nights: 55, status: "Emerald" },
  { nights: 80, status: "Diamond" },
  { nights: 175, status: "Diamond Plus" },
  { nights: 700, status: "Pinnacle Club" },
];

const princessLoyalty = [
  { num: 1, nights: 1, status: "Gold" },
  { num: 3, nights: 30, status: "Ruby" },
  { num: 5, nights: 50, status: "Platinum" },
  { num: 15, nights: 150, status: "Elite" },
];

const virginLoyalty = [
  { num: 1, status: "Sailing Club" },
  { num: 2, status: "Blue Extras" },
  { num: 4, status: "Deep Blue Extras" },
];

const numDisney = [0, 0, 0, 0, 0, 0];
const numRC = [0];
const numPrincess = [0];
const numVirgin = [0];
let totalNightsCalc = 0;
let disneyCruises = 0;
let virginCruises = 0;
let rcNights = 0;
const princess: [number, number] = [0, 0];

cruises.forEach((cruise) => {
  totalNightsCalc += cruise.nights;

  switch (cruise.ship) {
    case ships[0]:
      numDisney[0] += 1;
      break;
    case ships[1]:
      numDisney[1] += 1;
      break;
    case ships[2]:
      numDisney[2] += 1;
      break;
    case ships[3]:
      numDisney[3] += 1;
      break;
    case ships[4]:
      numDisney[4] += 1;
      break;
    case ships[5]:
      numDisney[5] += 1;
      break;
    case ships[6]:
      numRC[0] += 1;
      break;
    case ships[7]:
      numPrincess[0] += 1;
      break;
    default:
      numVirgin[0] += 1;
  }

  switch (cruise.line) {
    case lines[0]:
      disneyCruises += 1;
      break;
    case lines[1]:
      rcNights += cruise.nights * (cruise.concierge ? 2 : 1);
      break;
    case lines[2]:
      princess[0] += cruise.concierge ? 2 : 1;
      princess[1] += cruise.nights;
      break;
    case lines[3]:
      virginCruises += 1;
      break;
    default:
      break;
  }
});

export const totalNights = totalNightsCalc;

// -------------------------     Loyalty Chart     ------------------------- //

export const loyaltyColors = [
  red[100], // None
  grey[400], // Silver
  amber[500], // Gold
  blueGrey[900], // Platinum
  grey[100], // Pearl
];

export const loyaltySeries: SeriesOptionsType[] = [
  {
    type: "column",
    name: "None",
    data: [
      Math.floor((disneyLoyalty[0].num / disneyCruises) * 100),
      // Virgin Cruises Here
      Math.floor((virginCruises / virginLoyalty[1].num) * 100),
      Math.floor((princessLoyalty[0].num / princessLoyalty[1].num) * 100),
      Math.floor((princessLoyalty[0].nights / princessLoyalty[1].nights) * 100),
      Math.floor((rcLoyalty[0].nights / rcLoyalty[1].nights) * 100),
    ],
  },
  {
    type: "column",
    name: "Silver",
    data: [
      Math.floor(
        ((disneyLoyalty[1].num - disneyLoyalty[0].num) / disneyCruises) * 100,
      ),
      0,
      0,
      0,
      0,
    ],
  },
  {
    type: "column",
    name: "Gold",
    data: [
      Math.floor(
        ((disneyLoyalty[2].num - disneyLoyalty[1].num) / disneyCruises) * 100,
      ),
      0,
      // Princess Cruises Here
      Math.floor(
        ((princess[0] - princessLoyalty[0].num) / princessLoyalty[1].num) * 100,
      ),
      // Princess Nights Here
      Math.floor(
        ((princess[1] - princessLoyalty[0].nights) /
          princessLoyalty[1].nights) *
          100,
      ),
      // Royal Caribbean Here
      Math.floor(
        ((rcNights - rcLoyalty[0].nights) / rcLoyalty[1].nights) * 100,
      ),
    ],
  },
  {
    type: "column",
    name: "Platinum",
    data: [
      Math.floor(
        ((disneyLoyalty[3].num - disneyLoyalty[2].num) / disneyCruises) * 100,
      ),
      0,
      0,
      0,
      0,
    ],
  },
  {
    type: "column",
    name: "Pearl",
    data: [
      Math.floor(
        ((disneyCruises - disneyLoyalty[3].num) / disneyCruises) * 100,
      ),
      0,
      0,
      0,
      0,
    ],
  },
];

// -------------------------     Sankey     ------------------------- //

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
    ["🛳", lines[0], disneyCruises],
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
    [lines[3], ships[8], numVirgin[0]], // Scarlet Lady
  ],
};
