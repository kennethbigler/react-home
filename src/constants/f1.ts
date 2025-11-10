import { lightGreen, red } from "@mui/material/colors";

// --------------------------------------------------     Shared     -------------------------------------------------- //
interface ChartEntry {
  data: (number | null)[];
  name: string;
  color: string;
}

// TODO: Dec 7, 2025 - add driver stats for 2025 & Update team numbers
// TODO: Mar 6, 2026 - Update team hex codes

export const MCLAREN_HEX = "#F47600";
export const MERCEDES_HEX = "#00D7B6";
export const FERRARI_HEX = "#ED1131";
export const RED_BULL_HEX = "#4781D7";
export const WILLIAMS_HEX = "#1868DB";
export const RB_HEX = "#6C98FF";
export const ASTON_HEX = "#229971";
export const AUDI_HEX = "#9B0000";
export const HAAS_HEX = "#9C9FA2";
export const ALPINE_HEX = "#00A1E8";
export const CADILLAC_HEX = "black";
// ----------     OLD     ---------- //
const K_SAUBER_HEX = "#01C00E";
const AT_HEX = "#5E8FAA";
const AR_HEX = "#C92D4B";
const RP_HEX = "#F596C8";
const RENAULT_HEX = "#FFF500";
const TR_HEX = "#0032FF";
const FI_HEX = "#F596C8";
const SAUBER_HEX = "#9B0000";

export const xAxisYears = [
  2018, 2019, 2020, 2021, 2022, 2023, 2024, 9.2025, 0.2026,
];

const pointSort = (a: ChartEntry, b: ChartEntry) =>
  (a.data[a.data.length - 1] || 0) - (b.data[b.data.length - 1] || 0);
const standingSort = (a: ChartEntry, b: ChartEntry) =>
  (b.data[b.data.length - 1] || 0) - (a.data[a.data.length - 1] || 0);

// --------------------------------------------------     Constructor Data     -------------------------------------------------- //
interface Constructor {
  name: string;
  color: string;
  points: (number | null)[];
  standings: (number | null)[];
}

export const constructors: Constructor[] = [
  {
    name: "McLaren",
    color: MCLAREN_HEX,
    points: [62, 145, 202, 275, 159, 302, 666, 756, 750],
    standings: [6, 4, 3, 4, 5, 4, 1, 1, 1],
  },
  {
    name: "Mercedes",
    color: MERCEDES_HEX,
    points: [655, 739, 573, 613.5, 515, 409, 468, 398, 400],
    standings: [1, 1, 1, 1, 3, 2, 4, 2, 2],
  },
  {
    name: "Red Bull Racing",
    color: RED_BULL_HEX,
    points: [419, 417, 319, 585.5, 759, 860, 589, 366, 380],
    standings: [3, 3, 2, 2, 1, 1, 3, 3, 3],
  },
  {
    name: "Ferrari",
    color: FERRARI_HEX,
    points: [571, 504, 131, 323.5, 554, 406, 652, 362, 360],
    standings: [2, 2, 6, 3, 2, 3, 2, 4, 4],
  },
  {
    name: "Williams",
    color: WILLIAMS_HEX,
    points: [7, 1, 0, 23, 8, 28, 17, 111, 120],
    standings: [10, 10, 10, 8, 10, 7, 9, 5, 5],
  },
  {
    name: "Racing Bulls",
    color: RB_HEX,
    points: [33, 85, 107, 142, 35, 25, 46, 82, 100],
    standings: [9, 6, 7, 6, 9, 8, 8, 6, 6],
  },
  {
    name: "Aston Martin",
    color: ASTON_HEX,
    points: [52, 73, 195, 77, 55, 280, 94, 72, 80],
    standings: [7, 7, 4, 7, 7, 5, 5, 7, 7],
  },
  {
    name: "Haas",
    color: HAAS_HEX,
    points: [93, 28, 3, 0, 37, 12, 58, 70, 60],
    standings: [5, 9, 9, 10, 8, 10, 7, 8, 8],
  },
  {
    name: "Audi",
    color: AUDI_HEX,
    points: [48, 57, 8, 13, 55, 16, 4, 62, 40],
    standings: [8, 8, 8, 9, 6, 9, 10, 9, 9],
  },
  {
    name: "Alpine",
    color: ALPINE_HEX,
    points: [122, 91, 181, 155, 173, 120, 65, 22, 20],
    standings: [4, 5, 5, 5, 4, 6, 6, 10, 10],
  },
  {
    name: "Cadillac",
    color: CADILLAC_HEX,
    points: [null, null, null, null, null, null, null, null, 0],
    standings: [null, null, null, null, null, null, null, null, 11],
  },
  // ----------     3nd Replacement     ---------- //
  {
    name: "Kick Sauber",
    color: K_SAUBER_HEX,
    points: [48, 57, 8, 13, 55, 16, 4, 60],
    standings: [8, 8, 8, 9, 6, 9, 10, 9, null],
  },
  // ----------     2nd Replacement     ---------- //
  {
    name: "AlphaTauri",
    color: AT_HEX,
    points: [33, 85, 107, 142, 35, 25],
    standings: [9, 6, 7, 6, 9, 8, null],
  },
  {
    name: "Alfa Romeo",
    color: AR_HEX,
    points: [48, 57, 8, 13, 55, 16],
    standings: [8, 8, 8, 9, 6, 9, null],
  },
  {
    name: "Racing Point",
    color: RP_HEX,
    points: [52, 73, 195],
    standings: [7, 7, 4, null],
  },
  // ----------     1st Replacement     ---------- //
  {
    name: "Renault",
    color: RENAULT_HEX,
    points: [122, 91, 181],
    standings: [4, 5, 5, null],
  },
  {
    name: "Toro Rosso",
    color: TR_HEX,
    points: [33, 85],
    standings: [9, 6, null],
  },
  {
    name: "Force India",
    color: FI_HEX,
    points: [52],
    standings: [7, null],
  },
  {
    name: "Sauber",
    color: SAUBER_HEX,
    points: [48],
    standings: [8, null],
  },
];

const constructorPointsData: ChartEntry[] = [];
const constructorStandingsData: ChartEntry[] = [];

constructors.forEach((constructor) => {
  const { name, color, points, standings } = constructor;
  constructorPointsData.push({ data: points, name, color });
  constructorStandingsData.push({ data: standings, name, color });
});

constructorPointsData.sort(pointSort);
constructorStandingsData.sort(standingSort);

export { constructorPointsData, constructorStandingsData };

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
    name: "Jack Aitken",
    nationality: "GBR",
    color: WILLIAMS_HEX,
    points: [null, null, 0],
    standings: [null, null, 22],
  },
  {
    name: "Alexander Albon",
    nationality: "THA",
    color: WILLIAMS_HEX,
    points: [null, 92, 105, null, 4, 27, 12, 70],
    standings: [null, 8, 7, null, 19, 13, 16, 8],
  },
  {
    name: "Fernando Alonso",
    nationality: "ESP",
    color: ASTON_HEX,
    points: [50, null, null, 81, 81, 206, 70, 30],
    standings: [11, null, null, 10, 9, 4, 9, 14],
  },
  {
    name: "Kimi Antonelli",
    nationality: "ITA",
    color: MERCEDES_HEX,
    points: [null, null, null, null, null, null, null, 78],
    standings: [null, null, null, null, null, null, null, 7],
  },
  {
    name: "Oliver Bearman",
    nationality: "GBR",
    color: HAAS_HEX,
    points: [null, null, null, null, null, null, 7, 16],
    standings: [null, null, null, null, null, null, 18, 19],
  },
  {
    name: "Gabriel Bortoleto",
    nationality: "BRA",
    color: K_SAUBER_HEX,
    points: [null, null, null, null, null, null, null, 18],
    standings: [null, null, null, null, null, null, null, 18],
  },
  {
    name: "Valtteri Bottas",
    nationality: "FIN",
    color: K_SAUBER_HEX,
    points: [247, 326, 223, 226, 49, 10, 0],
    standings: [5, 2, 2, 3, 10, 15, 22],
  },
  {
    name: "Franco Colapinto",
    nationality: "ARG",
    color: ALPINE_HEX,
    points: [null, null, null, null, null, null, 5, 0],
    standings: [null, null, null, null, null, null, 19, 20],
  },
  {
    name: "Nyck De Vries",
    nationality: "NED",
    color: WILLIAMS_HEX,
    points: [null, null, null, null, 2, 0],
    standings: [null, null, null, null, 21, 22],
  },
  {
    name: "Jack Doohan",
    nationality: "AUS",
    color: ALPINE_HEX,
    points: [null, null, null, null, null, null, 0, 0],
    standings: [null, null, null, null, null, null, 24, 21],
  },
  {
    name: "Marcus Ericsson",
    nationality: "SWE",
    color: SAUBER_HEX,
    points: [9],
    standings: [17],
  },
  {
    name: "Pietro Fittipaldi",
    nationality: "BRA",
    color: HAAS_HEX,
    points: [null, null, 0],
    standings: [null, null, 23],
  },
  {
    name: "Pierre Gasly",
    nationality: "FRA",
    color: ALPINE_HEX,
    points: [29, 95, 75, 110, 23, 62, 42, 20],
    standings: [15, 7, 10, 9, 14, 11, 10, 16],
  },
  {
    name: "Antonio Giovinazzi",
    nationality: "ITA",
    color: AR_HEX,
    points: [null, 14, 4, 3],
    standings: [null, 17, 17, 18],
  },
  {
    name: "Romain Grosjean",
    nationality: "FRA",
    color: HAAS_HEX,
    points: [37, 8, 2],
    standings: [14, 18, 19],
  },
  {
    name: "Zhou Guanyu",
    nationality: "CHN",
    color: K_SAUBER_HEX,
    points: [null, null, null, null, 6, 6, 4],
    standings: [null, null, null, null, 18, 18, 20],
  },
  {
    name: "Isack Hadjar",
    nationality: "FRA",
    color: RB_HEX,
    points: [null, null, null, null, null, null, null, 39],
    standings: [null, null, null, null, null, null, null, 9],
  },
  {
    name: "Lewis Hamilton",
    nationality: "GBR",
    color: FERRARI_HEX,
    points: [408, 413, 347, 387.5, 240, 234, 223, 121],
    standings: [1, 1, 1, 2, 6, 3, 7, 6],
  },
  {
    name: "Brendon Hartley",
    nationality: "NZL",
    color: TR_HEX,
    points: [4],
    standings: [19],
  },
  {
    name: "Nico Hulkenberg",
    nationality: "GER",
    color: K_SAUBER_HEX,
    points: [69, 37, 10, null, 0, 9, 41, 37],
    standings: [7, 14, 15, null, 22, 16, 11, 10],
  },
  {
    name: "Robert Kubica",
    nationality: "POL",
    color: AR_HEX,
    points: [null, 1, null, 0],
    standings: [null, 19, null, 20],
  },
  {
    name: "Daniil Kvyat",
    nationality: "RUS",
    color: AT_HEX,
    points: [null, 37, 32],
    standings: [null, 13, 14],
  },
  {
    name: "Nicholas Latifi",
    nationality: "CAN",
    color: WILLIAMS_HEX,
    points: [null, null, 0, 7, 2],
    standings: [null, null, 21, 17, 20],
  },
  {
    name: "Liam Lawson",
    nationality: "NZL",
    color: RB_HEX,
    points: [null, null, null, null, null, 2, 4, 30],
    standings: [null, null, null, null, null, 20, 21, 13],
  },
  {
    name: "Charles Leclerc",
    nationality: "MON",
    color: FERRARI_HEX,
    points: [39, 264, 98, 159, 308, 206, 356, 165],
    standings: [13, 4, 8, 7, 2, 5, 3, 5],
  },
  {
    name: "Kevin Magnussen",
    nationality: "DEN",
    color: HAAS_HEX,
    points: [56, 20, 1, null, 25, 3, 16],
    standings: [9, 16, 20, null, 13, 19, 15],
  },
  {
    name: "Nikita Mazepin",
    nationality: "RAF",
    color: HAAS_HEX,
    points: [null, null, null, 0],
    standings: [null, null, null, 21],
  },
  {
    name: "Lando Norris",
    nationality: "GBR",
    color: MCLAREN_HEX,
    points: [null, 49, 97, 160, 122, 205, 374, 299],
    standings: [null, 11, 9, 6, 7, 6, 2, 2],
  },
  {
    name: "Esteban Ocon",
    nationality: "FRA",
    color: HAAS_HEX,
    points: [49, null, 62, 74, 92, 58, 23, 28],
    standings: [12, null, 12, 11, 8, 12, 14, 15],
  },
  {
    name: "Sergio Perez",
    nationality: "MEX",
    color: RED_BULL_HEX,
    points: [62, 52, 125, 190, 305, 285, 152],
    standings: [8, 10, 4, 4, 3, 2, 8],
  },
  {
    name: "Oscar Piastri",
    nationality: "AUS",
    color: MCLAREN_HEX,
    points: [null, null, null, null, null, 97, 292, 324],
    standings: [null, null, null, null, null, 9, 4, 1],
  },
  {
    name: "Kimi Räikkönen",
    nationality: "FIN",
    color: AR_HEX,
    points: [251, 43, 4, 10],
    standings: [3, 12, 16, 16],
  },
  {
    name: "Daniel Ricciardo",
    nationality: "AUS",
    color: RB_HEX,
    points: [170, 54, 119, 115, 37, 6, 12],
    standings: [6, 9, 5, 8, 11, 17, 17],
  },
  {
    name: "George Russell",
    nationality: "GBR",
    color: MERCEDES_HEX,
    points: [null, 0, 3, 16, 275, 175, 245, 212],
    standings: [null, 20, 18, 15, 4, 8, 6, 4],
  },
  {
    name: "Carlos Sainz",
    nationality: "ESP",
    color: WILLIAMS_HEX,
    points: [53, 96, 105, 164.5, 246, 200, 290, 31],
    standings: [10, 6, 6, 5, 5, 7, 5, 12],
  },
  {
    name: "Logan Sargeant",
    nationality: "USA",
    color: WILLIAMS_HEX,
    points: [null, null, null, null, null, 1, 0],
    standings: [null, null, null, null, null, 21, 23],
  },
  {
    name: "Mick Schumacher",
    nationality: "GER",
    color: HAAS_HEX,
    points: [null, null, null, 0, 12],
    standings: [null, null, null, 19, 16],
  },
  {
    name: "Sergey Sirotkin",
    nationality: "RUS",
    color: WILLIAMS_HEX,
    points: [1],
    standings: [20],
  },
  {
    name: "Lance Stroll",
    nationality: "CAN",
    color: ASTON_HEX,
    points: [6, 21, 75, 34, 18, 74, 24, 32],
    standings: [18, 15, 11, 13, 15, 10, 13, 11],
  },
  {
    name: "Yuki Tsunoda",
    nationality: "JPN",
    color: RB_HEX,
    points: [null, null, null, 32, 12, 17, 30, 20],
    standings: [null, null, null, 14, 17, 14, 12, 17],
  },
  {
    name: "Stoffel Vandoorne",
    nationality: "BEL",
    color: MCLAREN_HEX,
    points: [12],
    standings: [16],
  },
  {
    name: "Max Verstappen",
    nationality: "NED",
    color: RED_BULL_HEX,
    points: [249, 278, 214, 395.5, 454, 575, 437, 255],
    standings: [4, 3, 3, 1, 1, 1, 1, 3],
  },
  {
    name: "Sebastian Vettel",
    nationality: "GER",
    color: ASTON_HEX,
    points: [320, 240, 33, 43, 37],
    standings: [2, 5, 13, 12, 12],
  },
];

const driverPointsData: ChartEntry[] = [];
const driverStandingsData: ChartEntry[] = [];

drivers.forEach((driver) => {
  const { name, color, points, standings } = driver;
  driverPointsData.push({ data: points, name, color });
  driverStandingsData.push({ data: standings, name, color });
});

driverPointsData.sort(pointSort);
driverStandingsData.sort(standingSort);

export { driverPointsData, driverStandingsData };

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
