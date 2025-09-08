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
