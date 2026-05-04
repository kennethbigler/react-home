import { green, deepOrange, red } from "@mui/material/colors";
import dateObj, { DateObj } from "../apis/DateHelper";

// --------------------------------------------------     Shared     -------------------------------------------------- //
interface ChartEntry {
  data: (number | null)[];
  name: string;
  color: string;
}

export const MCLAREN_HEX = "#ff8000";
export const MERCEDES_HEX = "#27f4d2";
export const FERRARI_HEX = "#e8002d";
export const RED_BULL_HEX = "#3671c6";
export const WILLIAMS_HEX = "#1868db";
export const RB_HEX = "#6692ff";
export const ASTON_HEX = "#229971";
export const AUDI_HEX = "#ff2d00";
export const HAAS_HEX = "#dee1e2";
export const ALPINE_HEX = "#00a1e8";
export const CADILLAC_HEX = "#aaaaad";

// ----------     OLD     ---------- //
const K_SAUBER_HEX = "#01C00E";
const AT_HEX = "#5E8FAA";
const AR_HEX = "#C92D4B";
const RP_HEX = "#F596C8";
const RENAULT_HEX = "#FFF900";
const TR_HEX = "#0032FF";
const FI_HEX = "#F596C8";
const SAUBER_HEX = "#9B0000";

export const xAxisYears = [
  2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
];

const pointSort = (a: ChartEntry, b: ChartEntry) =>
  (a.data[a.data.length - 1] || 0) - (b.data[b.data.length - 1] || 0);
const standingSort = (a: ChartEntry, b: ChartEntry) =>
  (b.data[b.data.length - 1] || 0) - (a.data[a.data.length - 1] || 0);

// --------------------------------------------------     Driver Data     -------------------------------------------------- //
interface Driver {
  name: string;
  color: string;
  points: (number | null)[];
  standings: (number | null)[];
  thisYear?: number[];
}

const drivers: Driver[] = [
  {
    name: "Jack Aitken",
    color: WILLIAMS_HEX,
    points: [null, null, 0],
    standings: [null, null, 22],
  },
  {
    name: "Alexander Albon",
    color: WILLIAMS_HEX,
    points: [null, 92, 105, null, 4, 27, 12, 73, 1],
    standings: [null, 8, 7, null, 19, 13, 16, 8, 17],
    thisYear: [0, 0, 0, 0, 1],
  },
  {
    name: "Fernando Alonso",
    color: ASTON_HEX,
    points: [50, null, null, 81, 81, 206, 70, 56, 0],
    standings: [11, null, null, 10, 9, 4, 9, 10, 21],
  },
  {
    name: "Kimi Antonelli",
    color: MERCEDES_HEX,
    points: [null, null, null, null, null, null, null, 150, 100],
    standings: [null, null, null, null, null, null, null, 7, 1],
    thisYear: [0, 18, 47, 72, 100],
  },
  {
    name: "Oliver Bearman",
    color: HAAS_HEX,
    points: [null, null, null, null, null, null, 7, 41, 17],
    standings: [null, null, null, null, null, null, 18, 13, 8],
    thisYear: [0, 6, 17, 17, 17],
  },
  {
    name: "Gabriel Bortoleto",
    color: AUDI_HEX,
    points: [null, null, null, null, null, null, null, 19, 2],
    standings: [null, null, null, null, null, null, null, 19, 15],
    thisYear: [0, 2, 2, 2, 2],
  },
  {
    name: "Valtteri Bottas",
    color: CADILLAC_HEX,
    points: [247, 326, 223, 226, 49, 10, 0, null, 0],
    standings: [5, 2, 2, 3, 10, 15, 22, null, 19],
  },
  {
    name: "Franco Colapinto",
    color: ALPINE_HEX,
    points: [null, null, null, null, null, null, 5, 0, 7],
    standings: [null, null, null, null, null, null, 19, 20, 11],
    thisYear: [0, 0, 1, 1, 7],
  },
  {
    name: "Nyck De Vries",
    color: WILLIAMS_HEX,
    points: [null, null, null, null, 2, 0],
    standings: [null, null, null, null, 21, 22],
  },
  {
    name: "Jack Doohan",
    color: ALPINE_HEX,
    points: [null, null, null, null, null, null, 0, 0],
    standings: [null, null, null, null, null, null, 24, 21],
  },
  {
    name: "Marcus Ericsson",
    color: SAUBER_HEX,
    points: [9],
    standings: [17],
  },
  {
    name: "Pietro Fittipaldi",
    color: HAAS_HEX,
    points: [null, null, 0],
    standings: [null, null, 23],
  },
  {
    name: "Pierre Gasly",
    color: ALPINE_HEX,
    points: [29, 95, 75, 110, 23, 62, 42, 22, 16],
    standings: [15, 7, 10, 9, 14, 11, 10, 18, 9],
    thisYear: [0, 1, 9, 15, 16],
  },
  {
    name: "Antonio Giovinazzi",
    color: AR_HEX,
    points: [null, 14, 4, 3],
    standings: [null, 17, 17, 18],
  },
  {
    name: "Romain Grosjean",
    color: HAAS_HEX,
    points: [37, 8, 2],
    standings: [14, 18, 19],
  },
  {
    name: "Zhou Guanyu",
    color: K_SAUBER_HEX,
    points: [null, null, null, null, 6, 6, 4],
    standings: [null, null, null, null, 18, 18, 20],
  },
  {
    name: "Isack Hadjar",
    color: RED_BULL_HEX,
    points: [null, null, null, null, null, null, null, 51, 4],
    standings: [null, null, null, null, null, null, null, 12, 13],
    thisYear: [0, 0, 4, 4, 4],
  },
  {
    name: "Lewis Hamilton",
    color: FERRARI_HEX,
    points: [408, 413, 347, 387.5, 240, 234, 223, 156, 51],
    standings: [1, 1, 1, 2, 6, 3, 7, 6, 5],
    thisYear: [0, 12, 33, 41, 51],
  },
  {
    name: "Brendon Hartley",
    color: TR_HEX,
    points: [4],
    standings: [19],
  },
  {
    name: "Nico Hulkenberg",
    color: AUDI_HEX,
    points: [69, 37, 10, null, 0, 9, 41, 51, 0],
    standings: [7, 14, 15, null, 22, 16, 11, 11, 18],
  },
  {
    name: "Robert Kubica",
    color: AR_HEX,
    points: [null, 1, null, 0],
    standings: [null, 19, null, 20],
  },
  {
    name: "Daniil Kvyat",
    color: AT_HEX,
    points: [null, 37, 32],
    standings: [null, 13, 14],
  },
  {
    name: "Nicholas Latifi",
    color: WILLIAMS_HEX,
    points: [null, null, 0, 7, 2],
    standings: [null, null, 21, 17, 20],
  },
  {
    name: "Liam Lawson",
    color: RB_HEX,
    points: [null, null, null, null, null, 2, 4, 38, 10],
    standings: [null, null, null, null, null, 20, 21, 14, 10],
    thisYear: [0, 0, 8, 10, 10],
  },
  {
    name: "Charles Leclerc",
    color: FERRARI_HEX,
    points: [39, 264, 98, 159, 308, 206, 356, 242, 59],
    standings: [13, 4, 8, 7, 2, 5, 3, 5, 3],
    thisYear: [0, 15, 34, 49, 59],
  },
  {
    name: "Arvid Lindblad",
    color: RB_HEX,
    points: [null, null, null, null, null, null, null, null, 4],
    standings: [null, null, null, null, null, null, null, null, 12],
    thisYear: [0, 4, 4, 4, 4],
  },
  {
    name: "Kevin Magnussen",
    color: HAAS_HEX,
    points: [56, 20, 1, null, 25, 3, 16],
    standings: [9, 16, 20, null, 13, 19, 15],
  },
  {
    name: "Nikita Mazepin",
    color: HAAS_HEX,
    points: [null, null, null, 0],
    standings: [null, null, null, 21],
  },
  {
    name: "Lando Norris",
    color: MCLAREN_HEX,
    points: [null, 49, 97, 160, 122, 205, 374, 423, 51],
    standings: [null, 11, 9, 6, 7, 6, 2, 1, 4],
    thisYear: [0, 10, 15, 25, 51],
  },
  {
    name: "Esteban Ocon",
    color: HAAS_HEX,
    points: [49, null, 62, 74, 92, 58, 23, 38, 1],
    standings: [12, null, 12, 11, 8, 12, 14, 15, 16],
    thisYear: [0, 0, 0, 1, 1],
  },
  {
    name: "Sergio Perez",
    color: CADILLAC_HEX,
    points: [62, 52, 125, 190, 305, 285, 152, null, 0],
    standings: [8, 10, 4, 4, 3, 2, 8, null, 20],
  },
  {
    name: "Oscar Piastri",
    color: MCLAREN_HEX,
    points: [null, null, null, null, null, 97, 292, 410, 43],
    standings: [null, null, null, null, null, 9, 4, 3, 6],
    thisYear: [0, 0, 3, 21, 43],
  },
  {
    name: "Kimi Räikkönen",
    color: AR_HEX,
    points: [251, 43, 4, 10],
    standings: [3, 12, 16, 16],
  },
  {
    name: "Daniel Ricciardo",
    color: RB_HEX,
    points: [170, 54, 119, 115, 37, 6, 12],
    standings: [6, 9, 5, 8, 11, 17, 17],
  },
  {
    name: "George Russell",
    color: MERCEDES_HEX,
    points: [null, 0, 3, 16, 275, 175, 245, 319, 80],
    standings: [null, 20, 18, 15, 4, 8, 6, 4, 2],
    thisYear: [0, 25, 51, 63, 80],
  },
  {
    name: "Carlos Sainz",
    color: WILLIAMS_HEX,
    points: [53, 96, 105, 164.5, 246, 200, 290, 64, 4],
    standings: [10, 6, 6, 5, 5, 7, 5, 9, 14],
    thisYear: [0, 0, 2, 2, 4],
  },
  {
    name: "Logan Sargeant",
    color: WILLIAMS_HEX,
    points: [null, null, null, null, null, 1, 0],
    standings: [null, null, null, null, null, 21, 23],
  },
  {
    name: "Mick Schumacher",
    color: HAAS_HEX,
    points: [null, null, null, 0, 12],
    standings: [null, null, null, 19, 16],
  },
  {
    name: "Sergey Sirotkin",
    color: WILLIAMS_HEX,
    points: [1],
    standings: [20],
  },
  {
    name: "Lance Stroll",
    color: ASTON_HEX,
    points: [6, 21, 75, 34, 18, 74, 24, 33, 0],
    standings: [18, 15, 11, 13, 15, 10, 13, 16, 22],
  },
  {
    name: "Yuki Tsunoda",
    color: RED_BULL_HEX,
    points: [null, null, null, 32, 12, 17, 30, 33],
    standings: [null, null, null, 14, 17, 14, 12, 17],
  },
  {
    name: "Stoffel Vandoorne",
    color: MCLAREN_HEX,
    points: [12],
    standings: [16],
  },
  {
    name: "Max Verstappen",
    color: RED_BULL_HEX,
    points: [249, 278, 214, 395.5, 454, 575, 437, 421, 26],
    standings: [4, 3, 3, 1, 1, 1, 1, 2, 7],
    thisYear: [0, 8, 8, 12, 26],
  },
  {
    name: "Sebastian Vettel",
    color: ASTON_HEX,
    points: [320, 240, 33, 43, 37],
    standings: [2, 5, 13, 12, 12],
  },
];

const driverPointsData: ChartEntry[] = [];
const driverStandingsData: ChartEntry[] = [];
const driverCurrentData: ChartEntry[] = [];

drivers.forEach((driver) => {
  const { name, color, points, standings, thisYear } = driver;
  driverPointsData.push({ data: points, name, color });
  driverStandingsData.push({ data: standings, name, color });
  if (thisYear) {
    driverCurrentData.push({ data: thisYear, name, color });
  }
});

driverPointsData.sort(pointSort);
driverStandingsData.sort(standingSort);
driverCurrentData.sort(pointSort);

export { driverPointsData, driverStandingsData, driverCurrentData };

// --------------------------------------------------     Constructor Data     -------------------------------------------------- //
interface Constructor {
  name: string;
  color: string;
  points: (number | null)[];
  standings: (number | null)[];
  thisYear?: number[];
}

// Audi History
const sauberPoints = [48];
const sauberStandings = [8];
const alphaRomeoPoints = [...sauberPoints, 57, 8, 13, 55, 16];
const alphaRomeoStandings = [...sauberStandings, 8, 8, 9, 6, 9];
const kickSauberPoints = [...alphaRomeoPoints, 4, 70];
const kickSauberStandings = [...alphaRomeoStandings, 10, 9];
// Aston Martin History
const forceIndiaPoints = [52];
const forceIndiaStandings = [7];
const racingPointPoints = [...forceIndiaPoints, 73, 195];
const racingPointStandings = [...forceIndiaStandings, 7, 4];
// Racing Bulls History
const toroRossoPoints = [33, 85];
const toroRossoStandings = [9, 6];
const alphaTauriPoints = [...toroRossoPoints, 107, 142, 35, 25];
const alphaTauriStandings = [...toroRossoStandings, 7, 6, 9, 8];
// Alpine History
const renaultPoints = [122, 91, 181];
const renaultStandings = [4, 5, 5];

// helper function
const filterDriver = (name: string) =>
  drivers.filter((driver) => driver.name === name);

// McLaren
const landoNorris = filterDriver("Lando Norris")[0].thisYear || [];
const oscarPiastri = filterDriver("Oscar Piastri")[0].thisYear || [];
// Mercedes
const georgeRussell = filterDriver("George Russell")[0].thisYear || [];
const kimiAntonelli = filterDriver("Kimi Antonelli")[0].thisYear || [];
// Red Bull
const maxVerstappen = filterDriver("Max Verstappen")[0].thisYear || [];
const isackHadjar = filterDriver("Isack Hadjar")[0].thisYear || [];
// Ferrari
const charlesLeclerc = filterDriver("Charles Leclerc")[0].thisYear || [];
const lewisHamilton = filterDriver("Lewis Hamilton")[0].thisYear || [];
// Williams
const carlosSainz = filterDriver("Carlos Sainz")[0].thisYear || [];
const alexanderAlbon = filterDriver("Alexander Albon")[0].thisYear || [];
// Racing Bulls
const liamLawson = filterDriver("Liam Lawson")[0].thisYear || [];
const arvidLindblad = filterDriver("Arvid Lindblad")[0].thisYear || [];
// Aston Martin
const fernandoAlonso = filterDriver("Fernando Alonso")[0].thisYear || [];
const lanceStroll = filterDriver("Lance Stroll")[0].thisYear || [];
// Haas
const oliverBearman = filterDriver("Oliver Bearman")[0].thisYear || [];
const estebanOcon = filterDriver("Esteban Ocon")[0].thisYear || [];
// Audi
const gabrielBortoleto = filterDriver("Gabriel Bortoleto")[0].thisYear || [];
const nicoHulkenberg = filterDriver("Nico Hulkenberg")[0].thisYear || [];
// Alpine
const pierreGasly = filterDriver("Pierre Gasly")[0].thisYear || [];
const francoColapinto = filterDriver("Franco Colapinto")[0].thisYear || [];
// Cadillac
const valtteriBottas = filterDriver("Valtteri Bottas")[0].thisYear || [];
const sergioPerez = filterDriver("Sergio Perez")[0].thisYear || [];

const numRaces = landoNorris.length - 1;
const getTotal = (d1: number[], d2: number[]) =>
  (d1[numRaces] || 0) + (d2[numRaces] || 0);

export const constructors: Constructor[] = [
  {
    name: "McLaren",
    color: MCLAREN_HEX,
    points: [
      62,
      145,
      202,
      275,
      159,
      302,
      666,
      833,
      getTotal(landoNorris, oscarPiastri),
    ],
    standings: [6, 4, 3, 4, 5, 4, 1, 1, 3],
    thisYear: landoNorris?.map((points, i) => points + (oscarPiastri[i] || 0)),
  },
  {
    name: "Mercedes",
    color: MERCEDES_HEX,
    points: [
      655,
      739,
      573,
      613.5,
      515,
      409,
      468,
      469,
      getTotal(kimiAntonelli, georgeRussell),
    ],
    standings: [1, 1, 1, 1, 3, 2, 4, 2, 1],
    thisYear: kimiAntonelli.map(
      (points, i) => points + (georgeRussell[i] || 0),
    ),
  },
  {
    name: "Red Bull Racing",
    color: RED_BULL_HEX,
    points: [
      419,
      417,
      319,
      585.5,
      759,
      860,
      589,
      451,
      getTotal(maxVerstappen, isackHadjar),
    ],
    standings: [3, 3, 2, 2, 1, 1, 3, 3, 6],
    thisYear: maxVerstappen.map((points, i) => points + (isackHadjar[i] || 0)),
  },
  {
    name: "Ferrari",
    color: FERRARI_HEX,
    points: [
      571,
      504,
      131,
      323.5,
      554,
      406,
      652,
      398,
      getTotal(charlesLeclerc, lewisHamilton),
    ],
    standings: [2, 2, 6, 3, 2, 3, 2, 4, 2],
    thisYear: charlesLeclerc.map(
      (points, i) => points + (lewisHamilton[i] || 0),
    ),
  },
  {
    name: "Williams",
    color: WILLIAMS_HEX,
    points: [
      7,
      1,
      0,
      23,
      8,
      28,
      17,
      137,
      getTotal(carlosSainz, alexanderAlbon),
    ],
    standings: [10, 10, 10, 8, 10, 7, 9, 5, 9],
    thisYear: carlosSainz.map((points, i) => points + (alexanderAlbon[i] || 0)),
  },
  {
    name: "Racing Bulls",
    color: RB_HEX,
    points: [...alphaTauriPoints, 46, 92, getTotal(liamLawson, arvidLindblad)],
    standings: [...alphaTauriStandings, 8, 6, 7],
    thisYear: liamLawson.map((points, i) => points + (arvidLindblad[i] || 0)),
  },
  {
    name: "Aston Martin",
    color: ASTON_HEX,
    points: [
      ...racingPointPoints,
      77,
      55,
      280,
      94,
      89,
      getTotal(fernandoAlonso, lanceStroll),
    ],
    standings: [...racingPointStandings, 7, 7, 5, 5, 7, 11],
    thisYear: fernandoAlonso.map((points, i) => points + (lanceStroll[i] || 0)),
  },
  {
    name: "Haas",
    color: HAAS_HEX,
    points: [
      93,
      28,
      3,
      0,
      37,
      12,
      58,
      79,
      getTotal(oliverBearman, estebanOcon),
    ],
    standings: [5, 9, 9, 10, 8, 10, 7, 8, 4],
    thisYear: oliverBearman.map((points, i) => points + (estebanOcon[i] || 0)),
  },
  {
    name: "Audi",
    color: AUDI_HEX,
    points: [...kickSauberPoints, getTotal(gabrielBortoleto, nicoHulkenberg)],
    standings: [...kickSauberStandings, 8],
    thisYear: gabrielBortoleto.map(
      (points, i) => points + (nicoHulkenberg[i] || 0),
    ),
  },
  {
    name: "Alpine",
    color: ALPINE_HEX,
    points: [
      ...renaultPoints,
      155,
      173,
      120,
      65,
      22,
      getTotal(pierreGasly, francoColapinto),
    ],
    standings: [...renaultStandings, 5, 4, 6, 6, 10, 5],
    thisYear: pierreGasly.map(
      (points, i) => points + (francoColapinto[i] || 0),
    ),
  },
  {
    name: "Cadillac",
    color: CADILLAC_HEX,
    points: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      getTotal(valtteriBottas, sergioPerez),
    ],
    standings: [null, null, null, null, null, null, null, null, 10],
    thisYear: valtteriBottas.map((points, i) => points + (sergioPerez[i] || 0)),
  },
  // ----------     3nd Replacement     ---------- //
  {
    name: "Kick Sauber",
    color: K_SAUBER_HEX,
    points: kickSauberPoints,
    standings: kickSauberStandings,
  },
  // ----------     2nd Replacement     ---------- //
  {
    name: "AlphaTauri",
    color: AT_HEX,
    points: alphaTauriPoints,
    standings: alphaTauriStandings,
  },
  {
    name: "Alfa Romeo",
    color: AR_HEX,
    points: alphaRomeoPoints,
    standings: alphaRomeoStandings,
  },
  {
    name: "Racing Point",
    color: RP_HEX,
    points: racingPointPoints,
    standings: racingPointStandings,
  },
  // ----------     1st Replacement     ---------- //
  {
    name: "Renault",
    color: RENAULT_HEX,
    points: renaultPoints,
    standings: renaultStandings,
  },
  {
    name: "Toro Rosso",
    color: TR_HEX,
    points: toroRossoPoints,
    standings: toroRossoStandings,
  },
  {
    name: "Force India",
    color: FI_HEX,
    points: forceIndiaPoints,
    standings: forceIndiaStandings,
  },
  {
    name: "Sauber",
    color: SAUBER_HEX,
    points: sauberPoints,
    standings: sauberStandings,
  },
];

const constructorPointsData: ChartEntry[] = [];
const constructorStandingsData: ChartEntry[] = [];
const constructorCurrentData: ChartEntry[] = [];

constructors.forEach((constructor) => {
  const { name, color, points, standings, thisYear } = constructor;
  constructorPointsData.push({ data: points, name, color });
  constructorStandingsData.push({ data: standings, name, color });
  if (thisYear) {
    constructorCurrentData.push({ data: thisYear, name, color });
  }
});

constructorPointsData.sort(pointSort);
constructorStandingsData.sort(standingSort);
constructorCurrentData.sort(pointSort);

export {
  constructorPointsData,
  constructorStandingsData,
  constructorCurrentData,
};

// --------------------------------------------------     Contract Data     -------------------------------------------------- //
export interface ContractData {
  color: string;
  start: DateObj;
  end: DateObj;
  inverted?: boolean;
  team: string;
}

export const contractData: ContractData[] = [
  {
    color: MCLAREN_HEX,
    team: "McLaren - Norris 🥇",
    start: dateObj("2019"),
    end: dateObj("2027-12"),
    inverted: true,
  },
  {
    color: TR_HEX,
    team: "Torro Rosso",
    start: dateObj("2015"),
    end: dateObj("2016-05"),
  },
  {
    color: RED_BULL_HEX,
    team: "Red Bull - Verstappen 🥇🥇🥇🥇",
    start: dateObj("2016-05"),
    end: dateObj("2028-12"),
  },
  {
    color: MCLAREN_HEX,
    team: "McLaren - Piastri",
    start: dateObj("2023"),
    end: dateObj("2028-12"),
    inverted: true,
  },
  {
    color: WILLIAMS_HEX,
    team: "Williams - Russell",
    start: dateObj("2019"),
    end: dateObj("2022"), // full 2021 Season
  },
  {
    color: MERCEDES_HEX,
    team: "Mercedes - Russell",
    start: dateObj("2022"),
    end: dateObj("2027-12"),
    inverted: true,
  },
  {
    color: SAUBER_HEX,
    team: "Sauber",
    start: dateObj("2018"),
    end: dateObj("2019"), // full 2018 Season
  },
  {
    color: FERRARI_HEX,
    team: "Ferrari - Leclerc",
    start: dateObj("2019"),
    end: dateObj("2029-12"),
  },
  {
    color: MCLAREN_HEX,
    team: "07-12 McLaren 🥇",
    start: dateObj("2012"), // actually 2007, shorten for better display
    end: dateObj("2013"), // full 2012 Season
    inverted: true,
  },
  {
    color: MERCEDES_HEX,
    team: "Mercedes - Hamilton 🥇🥇🥇🥇🥇🥇",
    start: dateObj("2013"),
    end: dateObj("2025"), // full 2024 Season
    inverted: true,
  },
  {
    color: FERRARI_HEX,
    team: "Ferrari - Hamilton",
    start: dateObj("2025"),
    end: dateObj("2026-12"),
  },
  {
    color: MERCEDES_HEX,
    team: "Mercedes - Antonelli",
    start: dateObj("2025"),
    end: dateObj("2026-12"),
    inverted: true,
  },
];

// --------------------------------------------------     Budget Data     -------------------------------------------------- //
/*
 * Modeled on a competitive midfield-to-front-running team (~$365M total, 2026 season).
 *
 * COST CAP (2026): $215M base for a season with ≤24 races (+$1.8M per race above 24).
 * Up from $135M in 2025 — the increase is described by the FIA as "roughly neutral
 * overall once changes are taken into account." Key structural changes:
 *
 *   NEW IN THE CAP (2026 vs 2024):
 *   - Infrastructure / Depreciation: The separate $36M/4-yr capex cap was scrapped.
 *     Annual depreciation of factories, wind tunnels, simulators, and IT is now counted
 *     inside the main $215M cap.
 *   - Full staff allocation: Costs must now be 100% F1-attributed if any time is spent
 *     on F1 projects. Previously teams could split shared-employee costs across F1 and
 *     non-F1 work. This meaningfully inflates the Staff line.
 *
 *   NEWLY EXPLICIT EXCLUSIONS (clarified in 2026 rules):
 *   - Health & safety costs
 *   - Catering at team factories and at race weekends
 *
 * STILL EXCLUDED FROM COST CAP (per FIA 2026 Financial Regs, confirmed F1.com Apr 2026):
 * Driver salaries/retainers, the three highest-paid non-driver employees (typically Team
 * Principal, CTO, Chief Aero), marketing & promotional activities, race-weekend
 * hospitality, race travel & accommodation costs, legal/HR/finance admin, sustainability
 * programs, and heritage car programs.
 *
 * SEPARATE PU CAP (2026): $190M for power unit manufacturers (up from $95M + inflation
 * in 2023-2025, for the same reason — capex depreciation folded in). Customer teams pay
 * a regulated maximum customer price, excluded from the team cost cap.
 *
 * REVENUE CONTEXT (2024 baseline, 2026 estimates scaled with F1's growth):
 * Prize money alone ranged from ~$93M (Williams, 9th) to ~$222M (Ferrari) in 2024.
 * Total revenues: midfield ~$200-300M, front-runners ~$400-650M+.
 *
 * DRIVER SALARIES (2025 estimates, excluded from cap):
 * Verstappen ~$76M, Hamilton ~$70.5M, Norris ~$57.5M, Piastri ~$37.5M, Leclerc ~$30M.
 *
 * Sources: FIA 2026 Financial Regulations (Section D, Issue 04); F1.com (Apr 2026);
 * FOM prize fund disclosure; sportsorca.com cost cap analysis.
 * All values are in $M USD.
 */
export const budgetData = {
  nodes: [
    // Revenue — ~$365M est. (competitive midfield/upper-midfield team, 2026)
    { id: "Prize Money", name: "Prize<br>Money", color: green[800] }, // $100-160M midfield; $180-280M front-runner
    { id: "Title Sponsors", name: "Title<br>Sponsors", color: green[800] }, // $50-100M+ per year for top teams
    {
      id: "Principal Partners",
      name: "Principal<br>Partners",
      color: green[800],
    }, // Multiple partners at $15-40M each
    { id: "Manufacturer", color: green[800] }, // Works team / parent company support
    { id: "Suppliers", color: green[800] }, // Technical partners (cash + in-kind)
    {
      id: "Merch & Licensing",
      name: "Merch &<br>Licensing",
      color: green[800],
      height: 42,
    }, // $15-25M for competitive teams
    // Center
    { id: "🏎️", color: green[800] },
    // Cost cap split
    { id: "Cost Cap", name: "Cost<br>Cap", color: red.A700 }, // $215M, FIA 2026 cap
    { id: "Cap Exempt", name: "Cap<br>Exempt", color: deepOrange[500] }, // ~$150M, outside FIA cost cap
    // In Cost Cap — R&D ($50M)
    { id: "R&D", color: red.A700 },
    { id: "Wind Tunnel", color: red.A700 },
    { id: "CFD & Sim", color: red.A700 },
    { id: "Track Testing", color: red.A700 },
    // In Cost Cap — Capped Staff ($65M)
    // Larger than pre-2026 due to 100% allocation rule for shared employees
    { id: "Staff", color: red.A700 },
    { id: "Engineers", color: red.A700 },
    { id: "Mechanics", color: red.A700 },
    { id: "Strategy & IT", color: red.A700 },
    // In Cost Cap — Production ($45M)
    { id: "Production", color: red.A700 },
    { id: "Chassis", color: red.A700 },
    { id: "Power Unit", color: red.A700 }, // Customer PU at regulated max price; works teams use PU cap
    { id: "Components", color: red.A700 },
    // In Cost Cap — Infrastructure & Capex ($20M) — NEW IN 2026
    // Previously tracked under a separate $36M/4-yr rolling capex cap; now annual
    // depreciation of factory assets, simulators, and IT sits inside the main cap.
    { id: "Infrastructure", color: red.A700 },
    { id: "Factory & Facilities", color: red.A700 },
    { id: "Simulators", color: red.A700 },
    { id: "IT Systems", color: red.A700 },
    // In Cost Cap — Race Operations ($35M)
    { id: "Race Ops", name: "Race<br>Ops", color: red.A700 },
    { id: "Equipment", color: red.A700 },
    { id: "Freight", color: red.A700 }, // FOM covers a base freight allowance; teams pay overages
    { id: "Factory Ops", color: red.A700 },
    { id: "Fuel", color: red.A700 },
    // Cap Exempt spending (~$150M)
    // Two intermediate grouping nodes mirror the Cost Cap side's depth
    {
      id: "Drivers & Execs",
      name: "Drivers &<br>Execs",
      color: deepOrange[500],
    }, // Exempt salaries group ($77M)
    { id: "Brand & Travel", name: "Brand &<br>Travel", color: deepOrange[500] }, // Off-track operations group ($73M)
    { id: "Driver 1", color: deepOrange[500] }, // Midfield #1: ~$15-40M; top teams $30-76M
    { id: "Driver 2", color: deepOrange[500] }, // Midfield #2: ~$5-20M
    { id: "Top 3 Execs", color: deepOrange[500] }, // Team Principal + CTO + Chief Aero: ~$10-25M each
    { id: "Marketing", color: deepOrange[500] }, // Brand, PR, livery deals, social media
    { id: "Travel", color: deepOrange[500] }, // Race travel explicitly excluded (FIA 2026 Art. 2)
    { id: "Hospitality", color: deepOrange[500] }, // Paddock motorhome, partner events, Paddock Club
  ],
  data: [
    // Revenue ($365M est.)
    ["Prize Money", "🏎️", 150], // Estimated ~5th-7th place finish in 2026 prize pool
    ["Title Sponsors", "🏎️", 75], // e.g. Oracle/Red Bull, Petronas/Mercedes, HP/Ferrari
    ["Principal Partners", "🏎️", 60], // Several partners at $15-40M each
    ["Manufacturer", "🏎️", 40], // Works backing or parent company investment
    ["Suppliers", "🏎️", 22], // Technical partner cash + in-kind value
    ["Merch & Licensing", "🏎️", 18], // Team stores, licensing, driver academy revenue

    // Split into cost-cap and exempt spending
    ["🏎️", "Cost Cap", 215], // FIA 2026 cap: $215M base (capex depreciation now included)
    ["🏎️", "Cap Exempt", 150], // Drivers, top execs, marketing, travel, hospitality

    // In Cost Cap → big categories ($215M)
    ["Cost Cap", "R&D", 50],
    ["Cost Cap", "Staff", 65], // Higher than pre-2026: 100% allocation rule for shared staff
    ["Cost Cap", "Production", 45],
    ["Cost Cap", "Infrastructure", 20], // NEW in 2026: annual depreciation replaces old capex cap
    ["Cost Cap", "Race Ops", 35],

    // R&D ($50M)
    ["R&D", "Wind Tunnel", 20],
    ["R&D", "CFD & Sim", 20],
    ["R&D", "Track Testing", 10],

    // Capped Staff ($65M) — fully allocated per 2026 rules
    ["Staff", "Engineers", 32],
    ["Staff", "Mechanics", 22],
    ["Staff", "Strategy & IT", 11],

    // Production ($45M)
    ["Production", "Chassis", 18],
    ["Production", "Power Unit", 18], // Customer PU: ~$15-20M at regulated max price
    ["Production", "Components", 9],

    // Infrastructure & Capex ($20M) — new 2026 category
    ["Infrastructure", "Factory & Facilities", 8],
    ["Infrastructure", "Simulators", 7],
    ["Infrastructure", "IT Systems", 5],

    // Race Ops ($35M)
    ["Race Ops", "Equipment", 14],
    ["Race Ops", "Freight", 12],
    ["Race Ops", "Factory Ops", 6],
    ["Race Ops", "Fuel", 3],

    // Cap Exempt ($150M) — two intermediate groups mirror Cost Cap's depth
    ["Cap Exempt", "Drivers & Execs", 77], // Driver + exec salaries ($40+$15+$22)
    ["Cap Exempt", "Brand & Travel", 73], // Off-track operations ($30+$23+$20)
    ["Drivers & Execs", "Driver 1", 40], // Competitive #1 driver; top teams paying $30-76M+
    ["Drivers & Execs", "Driver 2", 15], // #2 driver; wide range $5-40M depending on team
    ["Drivers & Execs", "Top 3 Execs", 22], // TP + CTO + Chief Aero; Horner ~$10M, Wolff ~$7.5M
    ["Brand & Travel", "Marketing", 30], // Promotion, sponsorship activation, social media, PR
    ["Brand & Travel", "Travel", 23], // 24 races × staff flights & hotels (explicitly excluded 2026)
    ["Brand & Travel", "Hospitality", 20], // Motorhome build/ops + race-weekend partner entertainment
  ],
};
