import { lightGreen, red } from "@mui/material/colors";

// --------------------------------------------------     Constructor Data     -------------------------------------------------- //
interface Constructor {
  name: string;
  color: string;
  symbol: "circle" | "diamond" | "square" | "triangle" | "triangle-down";
  standings: (number | null)[];
  points: (number | null)[];
}

export const constructors: Constructor[] = [
  {
    name: "Mercedes",
    color: "#00D7B6",
    symbol: "square",
    standings: [1, 1, 1, 1, 3],
    points: [655, 739, 573, 613.5, 515],
  },
  {
    name: "Ferrari",
    color: "#ED1131",
    symbol: "diamond",
    standings: [2, 2, 6, 3, 2],
    points: [571, 504, 131, 323.5, 554],
  },
  {
    name: "Red Bull Racing",
    color: "#4781D7",
    symbol: "triangle",
    standings: [3, 3, 2, 2, 1],
    points: [419, 417, 319, 585.5, 759],
  },
  {
    name: "Alpine",
    color: "#00A1E8",
    symbol: "circle",
    standings: [4, 5, 5, 5, 4],
    points: [122, 91, 181, 155, 173],
  },
  {
    name: "Haas",
    color: "#9C9FA2",
    symbol: "square",
    standings: [5, 9, 9, 10, 8],
    points: [93, 28, 3, 0, 37],
  },
  {
    name: "McLaren",
    color: "#F47600",
    symbol: "triangle",
    standings: [6, 4, 3, 4, 5],
    points: [62, 145, 202, 275, 159],
  },
  {
    name: "Aston Martin",
    color: "#229971",
    symbol: "circle",
    standings: [7, 7, 4, 7, 7],
    points: [52, 73, 195, 77, 55],
  },
  {
    name: "Alfa Romeo",
    color: "#C92D4B",
    symbol: "circle",
    standings: [8, 8, 8, 9, 6],
    points: [48, 57, 8, 13, 55],
  },
  {
    name: "AlphaTauri",
    color: "#5E8FAA",
    symbol: "circle",
    standings: [9, 6, 7, 6, 9],
    points: [33, 85, 107, 142, 35],
  },
  {
    name: "Williams",
    color: "#1868DB",
    symbol: "triangle-down",
    standings: [10, 10, 10, 8, 10],
    points: [7, 1, 0, 23, 8],
  },
  // 2025 - Kick Sauber	#01C00E
  // 2025 - Racing Bulls	#6C98FF
  // ----------     2nd Replacement     ---------- //
  {
    name: "Racing Point",
    color: "#F596C8",
    symbol: "circle",
    standings: [7, 7, 4, null, null],
    points: [52, 73, 195, null, null],
  },
  // ----------     1st Replacement     ---------- //
  {
    name: "Force India",
    color: "#F596C8",
    symbol: "circle",
    standings: [7, null, null, null, null],
    points: [52, null, null, null, null],
  },
  {
    name: "Sauber",
    color: "#9B0000",
    symbol: "circle",
    standings: [8, null, null, null, null],
    points: [48, null, null, null, null],
  },
  {
    name: "Toro Rosso",
    color: "#0032FF",
    symbol: "circle",
    standings: [9, 6, null, null, null],
    points: [33, 85, null, null, null],
  },
  {
    name: "Renault",
    color: "#FFF500",
    symbol: "circle",
    standings: [4, 5, 5, null, null],
    points: [122, 91, 181, null, null],
  },
];

export const xAxisYears = [2018, 2019, 2020, 2021, 2022];

interface ChartEntry {
  data: (number | null)[];
  name: string;
  color: string;
  marker: { symbol: Constructor["symbol"] };
}

const constructorStandingsData: ChartEntry[] = [];
const constructorPointsData: ChartEntry[] = [];

constructors.forEach((team) => {
  constructorStandingsData.push({
    data: team.standings,
    name: team.name,
    color: team.color,
    marker: { symbol: team.symbol },
  });
  constructorPointsData.push({
    data: team.points,
    name: team.name,
    color: team.color,
    marker: { symbol: team.symbol },
  });
});

export { constructorStandingsData, constructorPointsData };

// --------------------------------------------------     Driver Data     -------------------------------------------------- //
interface Driver {
  name: string;
  nationality: string;
  color: string;
  points: (number | null)[];
  standings: (number | null)[];
}

const drivers: Driver[] = [
  {
    name: "Max Verstappen",
    nationality: "NED",
    color: constructors[2].color,
    points: [249, 278, 214, 395.5, 454],
    standings: [4, 3, 3, 1, 1],
  },
  {
    name: "Charles Leclerc",
    nationality: "MON",
    color: constructors[1].color,
    points: [39, 264, 98, 159, 308],
    standings: [13, 4, 8, 7, 2],
  },
  {
    name: "Sergio Perez",
    nationality: "MEX",
    color: constructors[2].color,
    points: [62, 52, 125, 190, 305],
    standings: [8, 10, 4, 4, 3],
  },
  {
    name: "George Russell",
    nationality: "GBR",
    color: constructors[0].color,
    points: [null, 0, 3, 16, 275],
    standings: [null, 20, 18, 15, 4],
  },
  {
    name: "Carlos Sainz",
    nationality: "ESP",
    color: constructors[1].color,
    points: [53, 96, 105, 164.5, 246],
    standings: [10, 6, 6, 5, 5],
  },
  {
    name: "Lewis Hamilton",
    nationality: "GBR",
    color: constructors[0].color,
    points: [408, 413, 347, 387.5, 240],
    standings: [1, 1, 1, 2, 6],
  },
  {
    name: "Lando Norris",
    nationality: "GBR",
    color: constructors[5].color,
    points: [null, 49, 97, 160, 122],
    standings: [null, 11, 9, 6, 7],
  },
  {
    name: "Esteban Ocon",
    nationality: "FRA",
    color: constructors[3].color,
    points: [49, null, 62, 74, 92],
    standings: [12, null, 12, 11, 8],
  },
  {
    name: "Fernando Alonso",
    nationality: "ESP",
    color: constructors[3].color,
    points: [50, null, null, 81, 81],
    standings: [11, null, null, 10, 9],
  },
  {
    name: "Valtteri Bottas",
    nationality: "FIN",
    color: constructors[7].color,
    points: [247, 326, 223, 226, 49],
    standings: [5, 2, 2, 3, 10],
  },
  {
    name: "Daniel Ricciardo",
    nationality: "AUS",
    color: constructors[5].color,
    points: [170, 54, 119, 115, 37],
    standings: [6, 9, 5, 8, 11],
  },
  {
    name: "Sebastian Vettel",
    nationality: "GER",
    color: constructors[6].color,
    points: [320, 240, 33, 43, 37],
    standings: [2, 5, 13, 12, 12],
  },
  {
    name: "Kevin Magnussen",
    nationality: "DEN",
    color: constructors[4].color,
    points: [56, 20, 1, null, 25],
    standings: [9, 16, 20, null, 13],
  },
  {
    name: "Pierre Gasly",
    nationality: "FRA",
    color: constructors[8].color,
    points: [29, 95, 75, 110, 23],
    standings: [15, 7, 10, 9, 14],
  },
  {
    name: "Lance Stroll",
    nationality: "CAN",
    color: constructors[6].color,
    points: [6, 21, 75, 34, 18],
    standings: [18, 15, 11, 13, 15],
  },
  {
    name: "Mick Schumacher",
    nationality: "GER",
    color: constructors[4].color,
    points: [null, null, null, 0, 12],
    standings: [null, null, null, 19, 16],
  },
  {
    name: "Yuki Tsunoda",
    nationality: "JPN",
    color: constructors[8].color,
    points: [null, null, null, 32, 12],
    standings: [null, null, null, 14, 17],
  },
  {
    name: "Zhou Guanyu",
    nationality: "CHN",
    color: constructors[7].color,
    points: [null, null, null, null, 6],
    standings: [null, null, null, null, 18],
  },
  {
    name: "Alexander Albon",
    nationality: "THA",
    color: constructors[9].color,
    points: [null, 92, 105, null, 4],
    standings: [null, 8, 7, null, 19],
  },
  {
    name: "Nicholas Latifi",
    nationality: "CAN",
    color: constructors[9].color,
    points: [null, null, 0, 7, 2],
    standings: [null, null, 21, 17, 20],
  },
  {
    name: "Nyck De Vries",
    nationality: "NED",
    color: constructors[9].color,
    points: [null, null, null, null, 2],
    standings: [null, null, null, null, 21],
  },
  {
    name: "Nico Hulkenberg",
    nationality: "GER",
    color: constructors[6].color,
    points: [69, 37, 10, null, 0],
    standings: [7, 14, 15, null, 22],
  },
  {
    name: "Kimi Räikkönen",
    nationality: "FIN",
    color: constructors[7].color,
    points: [251, 43, 4, 10, null],
    standings: [3, 12, 16, 16, null],
  },
  {
    name: "Antonio Giovinazzi",
    nationality: "ITA",
    color: constructors[7].color,
    points: [null, 14, 4, 3, null],
    standings: [null, 17, 17, 18, null],
  },
  {
    name: "Robert Kubica",
    nationality: "POL",
    color: constructors[7].color,
    points: [null, 1, null, 0, null],
    standings: [null, 19, null, 20, null],
  },
  {
    name: "Nikita Mazepin",
    nationality: "RAF",
    color: constructors[4].color,
    points: [null, null, null, 0, null],
    standings: [null, null, null, 21, null],
  },
  {
    name: "Daniil Kvyat",
    nationality: "RUS",
    color: constructors[8].color,
    points: [null, 37, 32, null, null],
    standings: [null, 13, 14, null, null],
  },
  {
    name: "Romain Grosjean",
    nationality: "FRA",
    color: constructors[4].color,
    points: [37, 8, 2, null, null],
    standings: [14, 18, 19, null, null],
  },
  {
    name: "Jack Aitken",
    nationality: "GBR",
    color: constructors[9].color,
    points: [null, null, 0, null, null],
    standings: [null, null, 22, null, null],
  },
  {
    name: "Pietro Fittipaldi",
    nationality: "BRA",
    color: constructors[4].color,
    points: [null, null, 0, null, null],
    standings: [null, null, 23, null, null],
  },
  {
    name: "Stoffel Vandoorne",
    nationality: "BEL",
    color: constructors[5].color,
    points: [12, null, null, null, null],
    standings: [16, null, null, null, null],
  },
  {
    name: "Marcus Ericsson",
    nationality: "SWE",
    color: constructors[12].color,
    points: [9, null, null, null, null],
    standings: [17, null, null, null, null],
  },
  {
    name: "Brendon Hartley",
    nationality: "NZL",
    color: constructors[13].color,
    points: [4, null, null, null, null],
    standings: [19, null, null, null, null],
  },
  {
    name: "Sergey Sirotkin",
    nationality: "RUS",
    color: constructors[9].color,
    points: [1, null, null, null, null],
    standings: [20, null, null, null, null],
  },
];

const driverStandingsData: ChartEntry[] = [];
const driverPointsData: ChartEntry[] = [];

drivers.forEach((driver) => {
  driverStandingsData.push({
    data: driver.standings,
    name: driver.name,
    color: driver.color,
    marker: { symbol: "circle" },
  });
});
drivers.forEach((driver) => {
  driverPointsData.push({
    data: driver.points,
    name: driver.name,
    color: driver.color,
    marker: { symbol: "circle" },
  });
});

export { driverStandingsData, driverPointsData };

// --------------------------------------------------     Budget Data     -------------------------------------------------- //
/* Engine 50% / R&D 8.8% / Manufacturing 7.5% / Capital Expenses 6.3% / Race Team 6.3% / Drivers 5% / Test Team 5% / Hydraulics 3.8% / Rent Bills, etc. 3.8% /Sponsor Chasing 3.8% */
export const budgetData = {
  nodes: [
    // income, $158M est
    { id: "Prize Money", color: lightGreen[300] },
    { id: "Title Sponsors", color: lightGreen[300] },
    { id: "Parent Co", color: lightGreen[300] },
    { id: "Principal Partners", color: lightGreen[300] },
    { id: "Suppliers", color: lightGreen[300] },
    { id: "Merchandising", color: lightGreen[300] },
    // center
    { id: "🏎️", color: red[200] },
    // big categories ($158M)
    { id: "R&D", color: red[200] },
    { id: "Salaries", color: red[200] },
    { id: "Production", color: red[200] },
    { id: "Operations", color: red[200] },
    // R&D ($41M)
    { id: "Wind-tunnel", color: red[200] },
    { id: "Track Testing", color: red[200] },
    { id: "Other", color: red[200] },
    // Salaries ($42M)
    { id: "Team", color: red[200] },
    { id: "Drivers", color: red[200] },
    { id: "Directors", color: red[200] },
    // Production ($39M)
    { id: "Manufacturing", color: red[200] },
    { id: "Engine", color: red[200] },
    { id: "Components", color: red[200] },
    // Operations ($36M)
    { id: "Logistic", color: red[200] },
    { id: "Entertainment", color: red[200] },
    { id: "Freight", color: red[200] },
    { id: "IT", color: red[200] },
    { id: "Factory", color: red[200] },
    { id: "Services", color: red[200] },
    { id: "Fuel", color: red[200] },
  ],
  data: [
    // income ($158M est)
    // Prize Money ($60-140M)
    ["Prize Money", "🏎️", 60],
    // Title Sponsors ($40-60M)
    ["Title Sponsors", "🏎️", 40],
    // Manufacturer Funding and Parent Companies ($100-300M)
    ["Parent Co", "🏎️", 30],
    // Principal Partners ($20-40M)
    ["Principal Partners", "🏎️", 20],
    // Official Suppliers / Supporters ($1-10M)
    ["Suppliers", "🏎️", 5],
    // Merchandising and Licensing ($0-20M)
    ["Merchandising", "🏎️", 3],
    // big categories ($158M est)
    ["🏎️", "R&D", 41],
    ["🏎️", "Salaries", 42],
    ["🏎️", "Production", 39],
    ["🏎️", "Operations", 36],
    // R&D ($41M)
    ["R&D", "Wind-tunnel", 16],
    ["R&D", "Track Testing", 10],
    ["R&D", "Other", 15],
    // Salaries ($42M)
    ["Salaries", "Team", 26],
    ["Salaries", "Drivers", 13],
    ["Salaries", "Directors", 3],
    // Production ($39M)
    ["Production", "Manufacturing", 13],
    ["Production", "Engine", 20],
    ["Production", "Components", 6],
    // Operations ($36M)
    ["Operations", "Logistic", 13],
    ["Operations", "Entertainment", 10],
    ["Operations", "Freight", 5],
    ["Operations", "IT", 3],
    ["Operations", "Factory", 2],
    ["Operations", "Services", 2],
    ["Operations", "Fuel", 1],
  ],
};
