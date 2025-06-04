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

enum Lines {
  Disney = "Disney",
  RC = "Royal Caribbean",
  Princess = "Princess",
  Virgin = "Virgin Voyages",
}

enum Ships {
  Magic = "Magic",
  Wonder = "Wonder",
  Dream = "Dream",
  Fantasy = "Fantasy",
  Wish = "Wish",
  Treasure = "Treasure",
  Destiny = "Destiny",
  Navigator = "Navigator of the Seas",
  Discovery = "Discovery",
  Scarlet = "Scarlet Lady",
}

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
    ship: Ships.Wonder,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2005-06"),
    nights: 7,
    name: "Mexican Riviera",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2011-06"),
    nights: 11,
    name: "Mediterranean",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2012-06"),
    nights: 7,
    name: "Alaska",
    ship: Ships.Wonder,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2013-07"),
    nights: 12,
    name: "Mediterranean",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2014-07"),
    nights: 7,
    name: "Alaska",
    ship: Ships.Wonder,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2015-07"),
    nights: 14,
    name: "Northern EU Capitals",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2015-08"),
    nights: 7,
    name: "Dover to Barcelona",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2015-12"),
    nights: 4,
    name: "Bahamas",
    ship: Ships.Dream,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2016-06"),
    nights: 12,
    name: "Iceland & Norway",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2016-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: Ships.Fantasy,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2017-05"),
    nights: 15,
    name: "Eastbound Transatlantic",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2017-12"),
    nights: 7,
    name: "Western Caribbean",
    ship: Ships.Fantasy,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2018-05"),
    nights: 13,
    name: "Eastbound Transatlantic",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2018-07"),
    nights: 10,
    name: "Mediterranean",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2018-11"),
    nights: 7,
    name: "East Coast NY-FL-NY",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2019-09"),
    nights: 10,
    name: "Westbound Transatlantic",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2019-11"),
    nights: 7,
    name: "Western Caribbean",
    ship: Ships.Fantasy,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2021-12"),
    nights: 7,
    name: "Eastern Caribbean",
    ship: Ships.Fantasy,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2022-04"),
    nights: 10,
    name: "Vancouver to Honolulu",
    ship: Ships.Wonder,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2022-08"),
    nights: 4,
    name: "Catalina & Ensenada",
    ship: Ships.Navigator,
    line: Lines.RC,
    concierge: false,
  },
  {
    departure: dateObj("2022-12"),
    nights: 4,
    name: "Bahamas",
    ship: Ships.Wish,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2022-12"),
    nights: 3,
    name: "Bahamas",
    ship: Ships.Wish,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2023-02"),
    nights: 4,
    name: "San Diego & Ensenada",
    ship: Ships.Discovery,
    line: Lines.Princess,
    concierge: false,
  },
  {
    departure: dateObj("2023-05"),
    nights: 3,
    name: "Bahamas",
    ship: Ships.Dream,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2023-05"),
    nights: 13,
    name: "Eastbound Transatlantic",
    ship: Ships.Dream,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2024-03"),
    nights: 15,
    name: "Sydney to Honolulu",
    ship: Ships.Wonder,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2024-05"),
    nights: 3,
    name: "Bahamas",
    ship: Ships.Wish,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2024-09"),
    nights: 10,
    name: "Vancouver to Honolulu",
    ship: Ships.Wonder,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2024-12"),
    nights: 4,
    name: "Bahamas",
    ship: Ships.Fantasy,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2024-12"),
    nights: 7,
    name: "Maiden Voyage (Caribbean)",
    ship: Ships.Treasure,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2025-03"),
    nights: 7,
    name: "Galveston to San Juan",
    ship: Ships.Magic,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2025-05"),
    nights: 15,
    name: "Miami to Casablanca & Barcelona",
    ship: Ships.Scarlet,
    line: Lines.Virgin,
    concierge: false,
  },
  {
    departure: dateObj("2025-10"),
    nights: 4,
    name: "Bahamas",
    ship: Ships.Dream,
    line: Lines.Disney,
    concierge: true,
  },
  {
    departure: dateObj("2025-11"),
    nights: 4,
    name: "Bahamas",
    ship: Ships.Destiny,
    line: Lines.Disney,
    concierge: false,
  },
  {
    departure: dateObj("2026-04"),
    nights: 14,
    name: "Panama Canal",
    ship: Ships.Magic,
    line: Lines.Disney,
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

const numDisney = [0, 0, 0, 0, 0, 0, 0];
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
    case Ships.Magic:
      numDisney[0] += 1;
      break;
    case Ships.Wonder:
      numDisney[1] += 1;
      break;
    case Ships.Dream:
      numDisney[2] += 1;
      break;
    case Ships.Fantasy:
      numDisney[3] += 1;
      break;
    case Ships.Wish:
      numDisney[4] += 1;
      break;
    case Ships.Treasure:
      numDisney[5] += 1;
      break;
    case Ships.Destiny:
      numDisney[6] += 1;
      break;
    case Ships.Navigator:
      numRC[0] += 1;
      break;
    case Ships.Discovery:
      numPrincess[0] += 1;
      break;
    default:
      numVirgin[0] += 1;
  }

  switch (cruise.line) {
    case Lines.Disney:
      disneyCruises += 1;
      break;
    case Lines.RC:
      rcNights += cruise.nights * (cruise.concierge ? 2 : 1);
      break;
    case Lines.Princess:
      princess[0] += cruise.concierge ? 2 : 1;
      princess[1] += cruise.nights;
      break;
    case Lines.Virgin:
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
    { id: "🛳", color: cyan[400] },
    // lines
    { id: Lines.Disney, color: indigo[800] },
    { id: Lines.RC, color: cyan[400] },
    { id: Lines.Princess, color: blue[500] },
    { id: Lines.Virgin, color: red[900] },
    // ships
    { id: Ships.Magic, color: indigo[900] },
    { id: Ships.Wonder, color: "white" },
    { id: Ships.Dream, color: yellow[600] },
    { id: Ships.Fantasy, color: red[600] },
    { id: Ships.Wish, color: "black" },
    { id: Ships.Treasure, color: indigo[900] },
    { id: Ships.Destiny, color: "white" },
    { id: "Navigator", color: yellow[600] },
    { id: Ships.Discovery, color: red[600] },
    { id: Ships.Scarlet, color: "black" },
  ],
  data: [
    // level 1
    ["🛳", Lines.Disney, disneyCruises],
    ["🛳", Lines.RC, numRC[0]],
    ["🛳", Lines.Princess, numPrincess[0]],
    ["🛳", Lines.Virgin, numVirgin[0]],
    // level 2
    [Lines.Disney, Ships.Magic, numDisney[0]], // Magic
    [Lines.Disney, Ships.Wonder, numDisney[1]], // Wonder
    [Lines.Disney, Ships.Dream, numDisney[2]], // Dream
    [Lines.Disney, Ships.Fantasy, numDisney[3]], // Fantasy
    [Lines.Disney, Ships.Wish, numDisney[4]], // Wish
    [Lines.Disney, Ships.Treasure, numDisney[5]], // Treasure
    [Lines.Disney, Ships.Destiny, numDisney[6]], // Destiny
    [Lines.RC, "Navigator", numRC[0]], // Navigator
    [Lines.Princess, Ships.Discovery, numPrincess[0]], // Discovery
    [Lines.Virgin, Ships.Scarlet, numVirgin[0]], // Scarlet Lady
  ],
};
