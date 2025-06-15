import {
  amber,
  indigo,
  grey,
  red,
  lime,
  yellow,
  teal,
  orange,
} from "@mui/material/colors";
import dateObj, { DateObj } from "../apis/DateHelper";

import prius07 from "../images/cars/07_toyota_prius.png";
import voyager97 from "../images/cars/97_plymouth_voyager.png";
import pontiac93 from "../images/cars/93_pontiac_bonneville.webp";
import impala10 from "../images/cars/10_chevrolet_impala.webp";
import equinox10 from "../images/cars/10_chevy_equinox.png";
import mustang15 from "../images/cars/15_mustang_gt_premium.png";
import tesla16 from "../images/cars/16_tesla_x.webp";
import xj8l05 from "../images/cars/05_jaguar_xj8l.png";
import corvette18 from "../images/cars/18_corvette_zo6_3lz.png";
import ftype15 from "../images/cars/15_jaguar_f_type.webp";
import mustang20 from "../images/cars/20_ford_mustang.png";
import panamera21 from "../images/cars/21_porsche_panamera.png";
import bronco21 from "../images/cars/21_ford_bronco.webp";
import grom22 from "../images/cars/22_honda_grom.webp";
import porsche19 from "../images/cars/19_porsche_cayenne.webp";
import r1s25 from "../images/cars/25_rivian_r1s.webp";

export interface CarEntry {
  color: string;
  title: string;
  start: DateObj;
  kStart?: DateObj;
  fStart?: DateObj;
  end: DateObj;
  inverted?: boolean;
  car: string;
  char?: string;
  nickname?: string;
  src: string;
  transmission: string;
  horsepower: number;
  MPG: number;
  torque: number;
  weight: number;
  zTo60: number;
}

// --------------------------------------------------     Past Shared Cars     -------------------------------------------------- //

const irene = {
  color: grey[400],
  start: dateObj("2010-12"),
  fStart: dateObj("2015-02"),
  end: dateObj("2015-06"),
  car: "Impala",
  nickname: "Irene",
  title: "Chevrolet Impala LS (2010)",
  inverted: true,

  story:
    "After selling my first car, my parents purchased a 2010 Chevrolet Impala LS for me to drive. It was a used Hertz rental car.",
  src: impala10,
  transmission: "Automatic",

  horsepower: 211,
  MPG: 22,
  torque: 216,
  weight: 3555,
  zTo60: 8.3,
};

const tesla = {
  color: grey[50],
  start: dateObj("2016-03"),
  kStart: dateObj("2025-01"),
  end: dateObj("2025-06"),
  car: "Model X",
  char: "X",
  title: "Tesla Model X 90D (2016)",
  inverted: true,

  story:
    "My Father got a 2016 Tesla Model X 90D while I was working at Tesla. My dad and I traded cars in January 2025 so I could try all electric and he could try a plug-in hybrid.",
  src: tesla16,
  transmission: "Direct",

  horsepower: 417,
  MPG: 92,
  torque: 485,
  weight: 5271,
  zTo60: 4.8,
};

// --------------------------------------------------     Present Shared Cars     -------------------------------------------------- //

const camilla = {
  color: yellow[500],
  start: dateObj("2019-01"),
  fStart: dateObj("2021-10"),
  end: dateObj(),
  car: "Corvette",
  nickname: "Camilla",
  title: "Chevrolet Corvette Z06 (2018)",
  inverted: true,

  story:
    "To replace my Mustang I purchased a 2018 Chevrolet Corvette Z06 3LZ with the Z07 Track Package used from the Ron Fellows Performance Driving School. My parents purchased my car in October 2021 to keep it in the family.",
  src: corvette18,
  transmission: "Manual",

  horsepower: 650,
  MPG: 18,
  torque: 650,
  weight: 3524,
  zTo60: 3.1,
};

const cheyenne = {
  color: grey[50],
  start: dateObj("2023-08"),
  fStart: dateObj("2025-01"),
  end: dateObj(),
  car: "Cayenne",
  nickname: "Cheyenne",
  title: "Porsche Cayenne E-Hybrid (2019)",
  inverted: true,

  story:
    "I bought a plug-in 2019 Porsche Cayenne E-Hybrid as a bit of an upgrade to my old Bronco. My dad and I traded cars in January 2025 so I could try all electric and he could try a plug-in hybrid.",
  src: porsche19,
  transmission: "Automatic",

  horsepower: 455,
  MPG: 46,
  torque: 516,
  weight: 5060,
  zTo60: 4.7,
};

// --------------------------------------------------     Cars     -------------------------------------------------- //

const pastFamilyCarsNoRepeats: CarEntry[] = [
  {
    color: grey[50],
    start: dateObj("2008-03"),
    end: dateObj("2010-02"),
    car: "Voyager",
    title: "Plymouth Voyager (1997)",
    inverted: true,
    src: voyager97,
    transmission: "Automatic",

    horsepower: 158,
    MPG: 21,
    torque: 203,
    weight: 3696,
    zTo60: 10.1,
  },
  {
    color: indigo[500],
    start: dateObj("2008-03"),
    end: dateObj("2016-08"),
    car: "Prius",
    title: "Toyota Prius (2007)",
    src: prius07,
    transmission: "Automatic",

    horsepower: 110,
    MPG: 46,
    torque: 82,
    weight: 2932,
    zTo60: 10.4,
  },
  {
    color: lime[800],
    inverted: true,
    start: dateObj("2017-10"),
    end: dateObj("2021-08"),
    car: "Jag XJ8-L",
    char: "JX",
    title: "Jaguar XJ8-L (2005)",
    src: xj8l05,
    transmission: "Automatic",

    horsepower: 294,
    MPG: 19,
    torque: 303,
    weight: 3777,
    zTo60: 6.3,
  },
  {
    color: indigo[900],
    start: dateObj("2020-03"),
    end: dateObj("2022-10"),
    car: "MustangB",
    char: "Mb",
    nickname: "Miranda Jr",
    title: "Ford Mustang GT Premium (2020)",
    src: mustang20,
    transmission: "Manual",

    horsepower: 460,
    MPG: 18,
    torque: 420,
    weight: 3705,
    zTo60: 4.5,
  },
];

const currentFamilyCars: CarEntry[] = [
  {
    color: lime[800],
    inverted: true,
    start: dateObj("2010-02"),
    end: dateObj(),
    car: "Equinox",
    title: "Chevrolet Equinox LTZ (2010)",
    src: equinox10,
    transmission: "Automatic",

    horsepower: 182,
    MPG: 26,
    torque: 172,
    weight: 3838,
    zTo60: 8.7,
  },
  {
    color: grey[50],
    start: dateObj("2021-08"),
    end: dateObj(),
    car: "Panamera",
    char: "PP",
    title: "Porsche Panamera 4 E-Hybrid (2021)",
    inverted: true,
    src: panamera21,
    transmission: "Automatic",

    horsepower: 455,
    MPG: 22,
    torque: 516,
    weight: 4967,
    zTo60: 4.3,
  },
  camilla,
  cheyenne,
];

const pastKensCarsNoRepeats: CarEntry[] = [
  {
    color: grey[800],
    start: dateObj("2008-03"),
    end: dateObj("2010-12"),
    car: "Bonneville",
    char: "PB",
    nickname: "Petunia",
    title: "Pontiac Bonneville (1993)",
    src: pontiac93,
    transmission: "Automatic",

    horsepower: 205,
    MPG: 18,
    torque: 260,
    weight: 3607,
    zTo60: 8.5,
  },
  irene,
  {
    color: red[900],
    start: dateObj("2015-02"),
    end: dateObj("2019-01"),
    car: "Mustang",
    char: "Ma",
    nickname: "Miranda",
    title: "Ford Mustang GT Premium (2015)",
    src: mustang15,
    transmission: "Automatic",

    horsepower: 435 + 15,
    MPG: 19,
    torque: 400,
    weight: 3705,
    zTo60: 4.4,
  },
  {
    color: grey[50],
    start: dateObj("2018-03"),
    end: dateObj("2018-08"),
    car: "Jag F-Type",
    title: "Jaguar F-Type R Convertible (2015)",
    inverted: true,
    src: ftype15,
    transmission: "Manual",

    horsepower: 380,
    MPG: 22,
    torque: 339,
    weight: 3558,
    zTo60: 5.1,
  },
  {
    color: teal[100],
    start: dateObj("2021-10"),
    end: dateObj("2023-03"),
    car: "Bronco",
    nickname: "Betty",
    title: "Ford Bronco Badlands (2021)",
    inverted: true,
    src: bronco21,
    transmission: "Manual",

    horsepower: 270,
    MPG: 18,
    torque: 310,
    weight: 4499,
    zTo60: 7.4,
  },
  {
    color: grey[900],
    start: dateObj("2022-04"),
    end: dateObj("2025-02"),
    car: "Grom",
    title: "Honda Grom (2022)",
    src: grom22,
    transmission: "Sequential",

    horsepower: parseFloat((9.7 * 1.139).toPrecision(3)),
    MPG: 130,
    torque: parseFloat((7.7 * 1.143).toPrecision(3)),
    weight: 230,
    zTo60: 13,
  },
  tesla,
];

const currentKensCars: CarEntry[] = [
  {
    color: amber.A100,
    start: dateObj("2025-06"),
    end: dateObj(),
    car: "R1S",
    char: "R",
    title: "Rivian R1S (2025)",
    inverted: true,
    src: r1s25,
    transmission: "Direct",

    horsepower: 850,
    MPG: 76,
    torque: 1103,
    weight: 6826,
    zTo60: 2.9,
  },
];

// --------------------------------------------------     Car Processing     -------------------------------------------------- //

export const cars: CarEntry[] = [
  ...pastKensCarsNoRepeats,
  ...currentKensCars,
  ...pastFamilyCarsNoRepeats,
  ...currentFamilyCars,
];

const pastKensCars = [...pastKensCarsNoRepeats, camilla, cheyenne];
const pastFamilyCars = [...pastFamilyCarsNoRepeats, irene, tesla];

export const hideFamilyCars = [...pastKensCars, ...currentKensCars];
export const hideKenCars = [...pastFamilyCars, ...currentFamilyCars];

export { pastKensCars, currentKensCars, pastFamilyCars, currentFamilyCars };

// --------------------------------------------------     Normalized Graphs     -------------------------------------------------- //

type HighChartsData = [string, number];
interface GraphData {
  xAxis: string[];
  horsepower: HighChartsData[];
  MPG: HighChartsData[];
  torque: HighChartsData[];
  weight: HighChartsData[];
  zTo60: HighChartsData[];
  powerToWeight: HighChartsData[];
}

const smoothData = (cur: number, high: number, low: number) =>
  Math.floor(100 * ((cur - low) / (high - low)));

const getMinAndMax = (data: CarEntry[]) => {
  const max = {
    horsepower: data[0].horsepower,
    MPG: data[0].MPG,
    torque: data[0].torque,
    weight: data[0].weight,
    zTo60: data[0].zTo60,
    powerToWeight: data[0].horsepower / data[0].weight,
  };
  const min = { ...max };

  // find the min and max values in the array
  for (let i = 1; i < data.length; i += 1) {
    const { horsepower, MPG, torque, weight, zTo60 } = data[i];
    const powerToWeight = horsepower / weight;

    if (horsepower > max.horsepower) {
      max.horsepower = horsepower;
    } else if (horsepower < min.horsepower) {
      min.horsepower = horsepower;
    }
    if (MPG > max.MPG) {
      max.MPG = MPG;
    } else if (MPG < min.MPG) {
      min.MPG = MPG;
    }
    if (torque > max.torque) {
      max.torque = torque;
    } else if (torque < min.torque) {
      min.torque = torque;
    }
    if (weight > max.weight) {
      max.weight = weight;
    } else if (weight < min.weight) {
      min.weight = weight;
    }
    if (zTo60 > max.zTo60) {
      max.zTo60 = zTo60;
    } else if (zTo60 < min.zTo60) {
      min.zTo60 = zTo60;
    }
    if (powerToWeight > max.powerToWeight) {
      max.powerToWeight = powerToWeight;
    } else if (powerToWeight < min.powerToWeight) {
      min.powerToWeight = powerToWeight;
    }
  }

  return { min, max };
};

export const processData = (allData: CarEntry[]): GraphData => {
  const data = allData.sort(
    (a, b) => a.horsepower / a.weight - b.horsepower / b.weight,
  );

  const ret: GraphData = {
    xAxis: [],
    horsepower: [],
    MPG: [],
    torque: [],
    weight: [],
    zTo60: [],
    powerToWeight: [],
  };

  if (data.length === 0) {
    return ret;
  }

  const { min, max } = getMinAndMax(data);

  // normalize the data to all fit on the same graph (0-1)
  data.forEach((car: CarEntry) => {
    const powerToWeight = car.horsepower / car.weight;
    ret.xAxis.push(car.char || car.car[0]);
    ret.horsepower.push([
      car.car,
      smoothData(car.horsepower, max.horsepower, min.horsepower),
    ]);
    ret.MPG.push([car.car, smoothData(car.MPG, max.MPG, min.MPG)]);
    ret.torque.push([car.car, smoothData(car.torque, max.torque, min.torque)]);
    ret.weight.push([car.car, smoothData(car.weight, max.weight, min.weight)]);
    ret.zTo60.push([car.car, smoothData(car.zTo60, max.zTo60, min.zTo60)]);
    ret.powerToWeight.push([
      car.car,
      smoothData(powerToWeight, max.powerToWeight, min.powerToWeight),
    ]);
  });

  return ret;
};

// --------------------------------------------------     Current Car Ranked     -------------------------------------------------- //

export interface CurrentCarStatsData {
  maxVal: number;
  val: number;
  name: string;
}

const getP2W = (c: CarEntry) =>
  parseFloat((c.horsepower / c.weight).toFixed(3));

export const processCurrentCarStats = (
  key: "zTo60" | "horsepower" | "MPG" | "torque" | "weight" | "powerToWeight",
): CurrentCarStatsData => {
  const idx = 0;
  const currentValue =
    key === "powerToWeight"
      ? getP2W(currentKensCars[idx])
      : currentKensCars[idx][key];

  let max = currentValue;
  cars.forEach((c) => {
    const val = key === "powerToWeight" ? getP2W(c) : c[key];
    if (val > max) {
      max = val;
    }
  });

  return {
    maxVal: max,
    val: currentValue,
    name: currentKensCars[idx].car,
  };
};

// --------------------------------------------------     Sankey     -------------------------------------------------- //

export const carSankeyNodes = [
  // level 1
  //     Japan
  { id: "Honda", color: red[500] },
  { id: "Toyota", color: indigo[400] },
  //     US
  { id: "Ford", color: indigo[900] },
  { id: "Tesla", color: red[500] },
  { id: "Rivian", color: amber[500] },
  { id: "Chevrolet", color: yellow[700] },
  { id: "Pontiac", color: red[500] },
  { id: "Plymouth", color: grey[50] },
  //     Other
  { id: "Porsche", color: orange[500] },
  { id: "Jaguar", color: lime[900] },

  // level 2
  //     US
  { id: "GM", color: yellow[700], offset: 70 },
  { id: "Stellantis", color: grey[50], offset: 70 },
  //     Other
  { id: "Volkswagen", color: orange[500], offset: 70 },
  { id: "TATA", color: lime[900], offset: 70 },

  // level 3
  { id: "🇯🇵", color: red[500], column: 2 },
  { id: "🇺🇸", color: indigo[900], column: 2 },
  { id: "🇩🇪", color: orange[500], column: 2 },
  { id: "🇬🇧", color: lime[900], column: 2 },

  // level 4
  { id: "🏎️", color: grey[200] },
];

export const familySankeyData = [
  // level 1
  //     Japan
  ["Toyota", "🇯🇵", 1],
  //     US
  ["Ford", "🇺🇸", 1],
  ["Tesla", "🇺🇸", 1],
  ["Chevrolet", "GM", 3],
  ["Plymouth", "Stellantis", 1],
  //     Other
  ["Porsche", "Volkswagen", 2],
  ["Jaguar", "TATA", 1],

  // level 2
  //     US
  ["GM", "🇺🇸", 3],
  ["Stellantis", "🇺🇸", 1],
  //     Other
  ["Volkswagen", "🇩🇪", 2],
  ["TATA", "🇬🇧", 1],

  // level 3
  ["🇯🇵", "🏎️", 1],
  ["🇺🇸", "🏎️", 6],
  ["🇩🇪", "🏎️", 2],
  ["🇬🇧", "🏎️", 1],
];

export const kenSankeyData = [
  // level 1
  //     Japan
  ["Honda", "🇯🇵", 1],
  //     US
  ["Ford", "🇺🇸", 2],
  ["Rivian", "🇺🇸", 1],
  ["Tesla", "🇺🇸", 1],
  ["Chevrolet", "GM", 2],
  ["Pontiac", "GM", 1],
  //     Other
  ["Porsche", "Volkswagen", 1],
  ["Jaguar", "TATA", 1],

  // level 2
  //     US
  ["GM", "🇺🇸", 3],
  //     Other
  ["Volkswagen", "🇩🇪", 1],
  ["TATA", "🇬🇧", 1],

  // level 3
  ["🇯🇵", "🏎️", 1],
  ["🇺🇸", "🏎️", 7],
  ["🇩🇪", "🏎️", 1],
  ["🇬🇧", "🏎️", 1],
];

export const carSankeyData = [
  // level 1
  //     Japan
  ["Honda", "🇯🇵", 1],
  ["Toyota", "🇯🇵", 1],
  //     US
  ["Ford", "🇺🇸", 3],
  ["Rivian", "🇺🇸", 1],
  ["Tesla", "🇺🇸", 1],
  ["Chevrolet", "GM", 3],
  ["Pontiac", "GM", 1],
  ["Plymouth", "Stellantis", 1],
  //     Other
  ["Porsche", "Volkswagen", 2],
  ["Jaguar", "TATA", 2],

  // level 2
  //     US
  ["GM", "🇺🇸", 4],
  ["Stellantis", "🇺🇸", 1],
  //     Other
  ["Volkswagen", "🇩🇪", 2],
  ["TATA", "🇬🇧", 2],

  // level 3
  ["🇯🇵", "🏎️", 2],
  ["🇺🇸", "🏎️", 10],
  ["🇩🇪", "🏎️", 2],
  ["🇬🇧", "🏎️", 2],
];
