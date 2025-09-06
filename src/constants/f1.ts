import { lightGreen, red } from "@mui/material/colors";

interface Team {
  name: string;
  color: string;
  standings: (number | null)[];
  points: (number | null)[];
}

const teams: Team[] = [
  {
    name: "Mercedes",
    color: "#00D2BE",
    standings: [1, 1, 1, 1],
    points: [655, 739, 573, 613.5],
  },
  {
    name: "Ferrari",
    color: "#DC0000",
    standings: [2, 2, 6, 3],
    points: [571, 504, 131, 323.5],
  },
  {
    name: "Red Bull Racing",
    color: "#1E41FF",
    standings: [3, 3, 2, 2],
    points: [419, 417, 319, 585.5],
  },
  {
    name: "Alpine",
    color: "#0090FF",
    standings: [4, 5, 5, 5],
    points: [122, 91, 181, 155],
  },
  {
    name: "Haas",
    color: "#FFFFFF",
    standings: [5, 9, 9, 10],
    points: [93, 28, 3, 0],
  },
  {
    name: "McLaren",
    color: "#FF8700",
    standings: [6, 4, 3, 4],
    points: [62, 145, 202, 275],
  },
  {
    name: "Aston Martin",
    color: "#006F62",
    standings: [7, 7, 4, 7],
    points: [52, 73, 195, 77],
  },
  {
    name: "Alfa Romeo",
    color: "#900000",
    standings: [8, 8, 8, 9],
    points: [48, 57, 8, 13],
  },
  {
    name: "AlphaTauri",
    color: "#2B4562",
    standings: [9, 6, 7, 6],
    points: [33, 85, 107, 142],
  },
  {
    name: "Williams",
    color: "#005AFF",
    standings: [10, 10, 10, 8],
    points: [7, 1, 0, 23],
  },
  // ----------     2nd Replacement     ---------- //
  {
    name: "Racing Point",
    color: "#F596C8",
    standings: [7, 7, 4, null],
    points: [52, 73, 195, null],
  },
  // ----------     1st Replacement     ---------- //
  {
    name: "Force India",
    color: "#F596C8",
    standings: [7, null, null, null],
    points: [52, null, null, null],
  },
  {
    name: "Sauber",
    color: "#9B0000",
    standings: [8, null, null, null],
    points: [48, null, null, null],
  },
  {
    name: "Toro Rosso",
    color: "#4E7C9B",
    standings: [9, 6, null, null],
    points: [33, 85, null, null],
  },
  {
    name: "Renault",
    color: "#FFF500",
    standings: [4, 5, 5, null],
    points: [122, 91, 181, null],
  },
];

export const xAxisYears = [2018, 2019, 2020, 2021];

const chartStandings: {
  data: (number | null)[];
  name: string;
  color: string;
}[] = [];
const chartPoints: { data: (number | null)[]; name: string; color: string }[] =
  [];

teams.forEach((team) => {
  chartStandings.push({
    data: team.standings,
    name: team.name,
    color: team.color,
  });
  chartPoints.push({
    data: team.points,
    name: team.name,
    color: team.color,
  });
});

export { chartStandings, chartPoints };

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
    // income, $158M est
    // Prize Money $60-140M
    ["Prize Money", "🏎️", 60],
    // Title Sponsors $40-60M
    ["Title Sponsors", "🏎️", 40],
    // Manufacturer Funding and Parent Companies $100-300M
    ["Parent Co", "🏎️", 30],
    // Principal Partners $20-40M
    ["Principal Partners", "🏎️", 20],
    // Official Suppliers / Supporters $1-10M
    ["Suppliers", "🏎️", 5],
    // Merchandising and Licensing $0-20M
    ["Merchandising", "🏎️", 3],
    // big categories ($158M)
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
