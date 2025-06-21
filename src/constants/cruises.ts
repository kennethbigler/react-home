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

enum Regions {
  Caribbean = "Caribbean",
  Europe = "Europe",
  Pacific = "Pacific",
  West = "America",
}

interface Cruise {
  concierge?: boolean;
  departure: DateObj;
  line: Lines;
  name: string;
  nights: number;
  ship: Ships;
  region: Regions;
}

export const cruises: Cruise[] = [
  {
    departure: dateObj("2004-04"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 3,
    ship: Ships.Wonder,
    region: Regions.Caribbean,
  },
  {
    departure: dateObj("2005-06"),
    line: Lines.Disney,
    name: "Mexican Riviera",
    nights: 7,
    ship: Ships.Magic,
    region: Regions.West,
  },
  {
    concierge: true,
    departure: dateObj("2011-06"),
    line: Lines.Disney,
    name: "Mediterranean",
    nights: 11,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    departure: dateObj("2012-06"),
    line: Lines.Disney,
    name: "Alaska",
    nights: 7,
    ship: Ships.Wonder,
    region: Regions.West,
  },
  {
    concierge: true,
    departure: dateObj("2013-07"),
    line: Lines.Disney,
    name: "Mediterranean",
    nights: 12,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    departure: dateObj("2014-07"),
    line: Lines.Disney,
    name: "Alaska",
    nights: 7,
    ship: Ships.Wonder,
    region: Regions.West,
  },
  {
    concierge: true,
    departure: dateObj("2015-07"),
    line: Lines.Disney,
    name: "Northern EU Capitals",
    nights: 14,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    concierge: true,
    departure: dateObj("2015-08"),
    line: Lines.Disney,
    name: "Dover to Barcelona",
    nights: 7,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    departure: dateObj("2015-12"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 4,
    ship: Ships.Dream,
    region: Regions.Caribbean,
  },
  {
    departure: dateObj("2016-06"),
    line: Lines.Disney,
    name: "Iceland & Norway",
    nights: 12,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    departure: dateObj("2016-12"),
    line: Lines.Disney,
    name: "Eastern Caribbean",
    nights: 7,
    ship: Ships.Fantasy,
    region: Regions.Caribbean,
  },
  {
    departure: dateObj("2017-05"),
    line: Lines.Disney,
    name: "Eastbound Transatlantic",
    nights: 15,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    departure: dateObj("2017-12"),
    line: Lines.Disney,
    name: "Western Caribbean",
    nights: 7,
    ship: Ships.Fantasy,
    region: Regions.Caribbean,
  },
  {
    departure: dateObj("2018-05"),
    line: Lines.Disney,
    name: "Eastbound Transatlantic",
    nights: 13,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    departure: dateObj("2018-07"),
    line: Lines.Disney,
    name: "Mediterranean",
    nights: 10,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    departure: dateObj("2018-11"),
    line: Lines.Disney,
    name: "East Coast NY-FL-NY",
    nights: 7,
    ship: Ships.Magic,
    region: Regions.West,
  },
  {
    concierge: true,
    departure: dateObj("2019-09"),
    line: Lines.Disney,
    name: "Westbound Transatlantic",
    nights: 10,
    ship: Ships.Magic,
    region: Regions.Europe,
  },
  {
    concierge: true,
    departure: dateObj("2019-11"),
    line: Lines.Disney,
    name: "Western Caribbean",
    nights: 7,
    ship: Ships.Fantasy,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2021-12"),
    line: Lines.Disney,
    name: "Eastern Caribbean",
    nights: 7,
    ship: Ships.Fantasy,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2022-04"),
    line: Lines.Disney,
    name: "Vancouver to Honolulu",
    nights: 10,
    ship: Ships.Wonder,
    region: Regions.Pacific,
  },
  {
    departure: dateObj("2022-08"),
    line: Lines.RC,
    name: "Catalina & Ensenada",
    nights: 4,
    ship: Ships.Navigator,
    region: Regions.West,
  },
  {
    departure: dateObj("2022-12"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 4,
    ship: Ships.Wish,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2022-12"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 3,
    ship: Ships.Wish,
    region: Regions.Caribbean,
  },
  {
    departure: dateObj("2023-02"),
    line: Lines.Princess,
    name: "San Diego & Ensenada",
    nights: 4,
    ship: Ships.Discovery,
    region: Regions.West,
  },
  {
    concierge: true,
    departure: dateObj("2023-05"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 3,
    ship: Ships.Dream,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2023-05"),
    line: Lines.Disney,
    name: "Eastbound Transatlantic",
    nights: 13,
    ship: Ships.Dream,
    region: Regions.Europe,
  },
  {
    concierge: true,
    departure: dateObj("2024-03"),
    line: Lines.Disney,
    name: "Sydney to Honolulu",
    nights: 15,
    ship: Ships.Wonder,
    region: Regions.Pacific,
  },
  {
    departure: dateObj("2024-05"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 3,
    ship: Ships.Wish,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2024-09"),
    line: Lines.Disney,
    name: "Vancouver to Honolulu",
    nights: 10,
    ship: Ships.Wonder,
    region: Regions.Pacific,
  },
  {
    concierge: true,
    departure: dateObj("2024-12"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 4,
    ship: Ships.Fantasy,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2024-12"),
    line: Lines.Disney,
    name: "Maiden Voyage (Caribbean)",
    nights: 7,
    ship: Ships.Treasure,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2025-03"),
    line: Lines.Disney,
    name: "Galveston to San Juan",
    nights: 7,
    ship: Ships.Magic,
    region: Regions.Caribbean,
  },
  {
    departure: dateObj("2025-05"),
    line: Lines.Virgin,
    name: "Miami to Casablanca & Barcelona",
    nights: 15,
    ship: Ships.Scarlet,
    region: Regions.Europe,
  },
  {
    concierge: true,
    departure: dateObj("2025-10"),
    line: Lines.Disney,
    name: "Bahamas",
    nights: 4,
    ship: Ships.Dream,
    region: Regions.Caribbean,
  },
  {
    departure: dateObj("2025-11"),
    line: Lines.Disney,
    name: "Maiden Voyage (Bahamas)",
    nights: 4,
    ship: Ships.Destiny,
    region: Regions.Caribbean,
  },
  {
    concierge: true,
    departure: dateObj("2026-04"),
    line: Lines.Disney,
    name: "Panama Canal",
    nights: 14,
    ship: Ships.Magic,
    region: Regions.West,
  },
];

// -------------------------     Loyalty & Regions     ------------------------- //

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

const regions = [0, 0, 0, 0];
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

  switch (cruise.region) {
    case Regions.Caribbean:
      regions[0] += 1;
      break;
    case Regions.Europe:
      regions[1] += 1;
      break;
    case Regions.Pacific:
      regions[2] += 1;
      break;
    case Regions.West:
      regions[3] += 1;
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
    // regions
    { id: Regions.Caribbean, color: indigo[800] },
    { id: Regions.Europe, color: "white" },
    { id: Regions.Pacific, color: yellow[600] },
    { id: Regions.West, color: red[600] },
    // center
    { id: "🛳", color: cyan[400] },
    // lines
    { id: Lines.Disney, color: indigo[800] },
    { id: "Royal C", color: cyan[400] },
    { id: Lines.Princess, color: blue[500] },
    { id: "Virgin", color: red[900] },
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
    // level 0
    [Regions.Caribbean, "🛳", regions[0]],
    [Regions.Europe, "🛳", regions[1]],
    [Regions.Pacific, "🛳", regions[2]],
    [Regions.West, "🛳", regions[3]],
    // level 1
    ["🛳", Lines.Disney, disneyCruises],
    ["🛳", "Royal C", numRC[0]],
    ["🛳", Lines.Princess, numPrincess[0]],
    ["🛳", "Virgin", numVirgin[0]],
    // level 2
    [Lines.Disney, Ships.Magic, numDisney[0]], // Magic
    [Lines.Disney, Ships.Wonder, numDisney[1]], // Wonder
    [Lines.Disney, Ships.Dream, numDisney[2]], // Dream
    [Lines.Disney, Ships.Fantasy, numDisney[3]], // Fantasy
    [Lines.Disney, Ships.Wish, numDisney[4]], // Wish
    [Lines.Disney, Ships.Treasure, numDisney[5]], // Treasure
    [Lines.Disney, Ships.Destiny, numDisney[6]], // Destiny
    ["Royal C", "Navigator", numRC[0]], // Navigator
    [Lines.Princess, Ships.Discovery, numPrincess[0]], // Discovery
    ["Virgin", Ships.Scarlet, numVirgin[0]], // Scarlet Lady
  ],
};
