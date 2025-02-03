import {
  indigo,
  grey,
  red,
  lime,
  yellow,
  teal,
  orange,
} from "@mui/material/colors";
import dateObj from "../apis/DateHelper";

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
import { DataEntry } from "../components/common/timeline-card/timeline-consts";

export interface CarEntry extends DataEntry {
  car: string;
  char: string;
  nickname?: string;
  owned: string;
  story: string;
  src: string;
  transmission: string;
  horsepower: number;
  MPG: number;
  torque: number;
  weight: number;
  zTo60: number;
}

const camilla = {
  color: yellow[500],
  car: "Corvette",
  short: "Vette",
  char: "C",
  nickname: "Camilla",
  title: "Chevrolet Corvette Z06 (2018)",
  inverted: true,

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
  car: "Cayenne",
  short: "Cyne",
  char: "C",
  nickname: "Cheyenne",
  title: "Porsche Cayenne E-Hybrid (2019)",
  inverted: true,

  src: porsche19,
  transmission: "Automatic",

  horsepower: 455,
  MPG: 46,
  torque: 516,
  weight: 5060,
  zTo60: 4.7,
};

const tesla = {
  color: grey[50],
  car: "Model X",
  short: "ModlX",
  char: "X",
  title: "Tesla Model X 90D (2016)",
  inverted: true,

  src: tesla16,
  transmission: "Direct",

  horsepower: 417,
  MPG: 92,
  torque: 485,
  weight: 5271,
  zTo60: 4.8,
};

// --------------------------------------------------     Cars     -------------------------------------------------- //

const pastFamilyCars: CarEntry[] = [
  {
    color: grey[50],
    start: dateObj("2008-03"),
    end: dateObj("2010-02"),
    car: "Voyager",
    short: "Voygr",
    char: "V",
    title: "Plymouth Voyager (1997)",
    inverted: true,

    owned: "1997 - 2010",
    story: "My Mother's 1997 Plymouth Voyager.",
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
    short: "Prius",
    char: "P",
    title: "Toyota Prius (2007)",

    owned: "2008 - 2016",
    story:
      "My Father's 2007 Toyota Prius. I learned to drive with my permit on this car.",
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
    short: "XJ8-L",
    char: "J",
    title: "Jaguar XJ8-L (2005)",

    owned: "2017 - 2021",
    story:
      "My Grandpa's 2005 Jaguar XJ8-L. He gave it to our family for my Brother.",
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
    short: "Mstng",
    char: "Mb",
    nickname: "Miranda Jr",
    title: "Ford Mustang GT Premium (2020)",

    owned: "2020 - 2022",
    story:
      "My Roommate's 2020 Ford Mustang GT Premium with the Performance Pack 1.",
    src: mustang20,
    transmission: "Manual",

    horsepower: 460,
    MPG: 18,
    torque: 420,
    weight: 3705,
    zTo60: 4.5,
  },
  {
    ...tesla,
    start: dateObj("2016-03"),
    end: dateObj("2025-01"),
    owned: "2016 - 2025",
    story: "My Father's 2016 Tesla Model X 90D.",
  },
];

const currentFamilyCars: CarEntry[] = [
  {
    color: lime[800],
    inverted: true,
    start: dateObj("2010-02"),
    end: dateObj(),
    car: "Equinox",
    short: "Eqnox",
    char: "E",
    title: "Chevrolet Equinox LTZ (2010)",

    owned: "2010 - Present",
    story: "My Mother's 2010 Chevrolet Equinox LTZ.",
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
    short: "Pnmra",
    char: "PP",
    title: "Porsche Panamera 4 E-Hybrid (2021)",
    inverted: true,

    owned: "2021 - Present",
    story: "My Mother's 2021 Porsche Panamera 4 E-Hybrid.",
    src: panamera21,
    transmission: "Automatic",

    horsepower: 455,
    MPG: 22,
    torque: 516,
    weight: 4967,
    zTo60: 4.3,
  },
  {
    ...camilla,
    start: dateObj("2021-10"),
    end: dateObj(),
    owned: "2021 - Present",
    story:
      "My parents purchased my 2018 Chevrolet Corvette Z06 3LZ with the Z07 Track Package to keep it in the family.",
  },
  {
    ...cheyenne,
    start: dateObj("2025-01"),
    end: dateObj(),
    owned: "2025 - Present",
    story:
      "My dad and I traded cars so I could try all electric and he could try a plug-in hybrid.",
  },
];

const pastKensCars: CarEntry[] = [
  {
    color: grey[800],
    start: dateObj("2008-03"),
    end: dateObj("2010-12"),
    car: "Bonneville",
    short: "Bonne",
    char: "P",
    nickname: "Petunia",
    title: "Pontiac Bonneville (1993)",

    owned: "2008 - 2010",
    story:
      "I got my first car: a 1993 Pontiac Bonneville. It was previously my Grandfather's and I got it as my first car when I got my license.",
    src: pontiac93,
    transmission: "Automatic",

    horsepower: 205,
    MPG: 18,
    torque: 260,
    weight: 3607,
    zTo60: 8.5,
  },
  {
    color: grey[400],
    start: dateObj("2010-12"),
    end: dateObj("2015-06"),
    car: "Impala",
    short: "Impla",
    char: "I",
    nickname: "Irene",
    title: "Chevrolet Impala LS (2010)",
    inverted: true,

    owned: "2010 - 2015",
    story:
      "After selling my first car, my parents purchased a 2010 Chevrolet Impala LS for me to drive. It was a used Hertz rental car.",
    src: impala10,
    transmission: "Automatic",

    horsepower: 211,
    MPG: 22,
    torque: 216,
    weight: 3555,
    zTo60: 8.3,
  },
  {
    color: red[900],
    start: dateObj("2015-02"),
    end: dateObj("2019-01"),
    car: "Mustang",
    short: "Mstng",
    char: "M1",
    nickname: "Miranda",
    title: "Ford Mustang GT Premium (2015)",

    owned: "2015 - 2019",
    story:
      "I purchased my first vehicle, a new 2015 Ford Mustang GT Premium with the 50 Years Edition Package. I did some modifications to this car including: " +
      "Rear Window Louvers, GT350 start button, metal pedals, ergonomic parking break, Borla Ford Racing Sport Catback Exhaust, & Hurst automatic shift lever.",
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
    short: "FType",
    char: "J",
    title: "Jaguar F-Type R Convertible (2015)",
    inverted: true,

    owned: "2018",
    story:
      "I rented a 2015 Jaguar F-Type R Convertible on Turo, which I wouldn't normally include in this list, but I totalled this car, so ended up having my insurance buy it! So I kind of owned it for one day.",
    src: ftype15,
    transmission: "Manual",

    horsepower: 380,
    MPG: 22,
    torque: 339,
    weight: 3558,
    zTo60: 5.1,
  },
  {
    ...camilla,
    start: dateObj("2019-01"),
    end: dateObj("2021-10"),
    owned: "2019 - 2021",
    story:
      "To replace my Mustang I purchased a 2018 Chevrolet Corvette Z06 3LZ with the Z07 Track Package used from the Ron Fellows Performance Driving School. I sold it to my parents.",
  },
  {
    color: teal[100],
    start: dateObj("2021-10"),
    end: dateObj("2023-03"),
    car: "Bronco",
    short: "Brnco",
    char: "B",
    nickname: "Betty",
    title: "Ford Bronco Badlands (2021)",
    inverted: true,

    owned: "2021 - 2023",
    story:
      "In an attempt to get a more practical daily driver, as well as dip my toes into the off-roading community, I purchased a 2021 Ford Bronco Badlands.",
    src: bronco21,
    transmission: "Manual",

    horsepower: 270,
    MPG: 18,
    torque: 310,
    weight: 4499,
    zTo60: 7.4,
  },
  {
    ...cheyenne,
    start: dateObj("2023-08"),
    end: dateObj("2025-01"),
    owned: "2023 - 2025",
    story:
      "I bought a plug-in 2019 Porsche Cayenne E-Hybrid as a bit of an upgrade to my old Bronco.",
  },
];

const currentKensCars: CarEntry[] = [
  {
    ...tesla,
    start: dateObj("2025-01"),
    end: dateObj(),
    owned: "2025 - Present",
    story:
      "My dad and I traded cars so I could try all electric and he could try a plug-in hybrid.",
  },
  {
    color: grey[900],
    start: dateObj("2022-04"),
    end: dateObj(),
    car: "Grom",
    short: "Grom",
    char: "G",
    title: "Honda Grom (2022)",

    owned: "2022 - Present",
    story: "I got my first motorcycle, a 2022 Honda Grom.",
    src: grom22,
    transmission: "Sequential",

    horsepower: parseFloat((9.7 * 1.139).toPrecision(3)),
    MPG: 130,
    torque: parseFloat((7.7 * 1.143).toPrecision(3)),
    weight: 230,
    zTo60: 13,
  },
];

const cars: CarEntry[] = [
  ...pastKensCars,
  ...currentKensCars,
  ...pastFamilyCars,
  ...currentFamilyCars,
];

export default cars;

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

export const processData = (allData: CarEntry[]): GraphData => {
  let hasCamilla = false;
  let hasCheyenne = false;
  let hasTesla = false;
  const data = allData
    .filter((car) => {
      let isUnique = true;
      if (car.title === camilla.title) {
        isUnique = !hasCamilla;
        hasCamilla = true;
      } else if (car.title === cheyenne.title) {
        isUnique = !hasCheyenne;
        hasCheyenne = true;
      } else if (car.title === tesla.title) {
        isUnique = !hasTesla;
        hasTesla = true;
      }
      return isUnique;
    })
    .sort((a, b) => a.horsepower / a.weight - b.horsepower / b.weight);

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
    const { horsepower, zTo60, MPG, torque, weight } = data[i];
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

  // normalize the data to all fit on the same graph (0-1)
  data.forEach((car: CarEntry) => {
    const powerToWeight = car.horsepower / car.weight;
    ret.xAxis.push(car.char);
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
  data: CarEntry[],
  key: "zTo60" | "horsepower" | "MPG" | "torque" | "weight" | "powerToWeight",
  isBike?: boolean,
): CurrentCarStatsData => {
  const idx = isBike ? 1 : 0;
  const currentValue =
    key === "powerToWeight"
      ? getP2W(currentKensCars[idx])
      : currentKensCars[idx][key];

  let max = currentValue;
  data.forEach((c) => {
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

export { pastKensCars, currentKensCars, pastFamilyCars, currentFamilyCars };

// --------------------------------------------------     Sankey     -------------------------------------------------- //

export const carSankeyNodes = [
  // level 1
  { id: "Honda", color: red[500] },
  { id: "Toyota", color: indigo[400] },
  { id: "Ford", color: indigo[900] },
  { id: "Tesla", color: red[500] },
  { id: "Chevrolet", color: yellow[700] },
  { id: "Pontiac", color: red[500] },
  { id: "Plymouth", color: grey[50] },
  { id: "Porsche", color: orange[500] },
  { id: "Jaguar", color: lime[900] },
  // level 2
  { id: "GM", color: yellow[700], offset: 70 },
  { id: "Fiat Chrysler Auto", color: grey[50], offset: 70 },
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
  ["Plymouth", "Fiat Chrysler Auto", 1],
  //     Other
  ["Porsche", "Volkswagen", 2],
  ["Jaguar", "TATA", 1],
  // level 2
  ["GM", "🇺🇸", 3],
  ["Fiat Chrysler Auto", "🇺🇸", 1],
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
  ["Tesla", "🇺🇸", 1],
  ["Chevrolet", "GM", 2],
  ["Pontiac", "GM", 1],
  //     Other
  ["Porsche", "Volkswagen", 1],
  ["Jaguar", "TATA", 1],
  // level 2
  ["GM", "🇺🇸", 3],
  ["Volkswagen", "🇩🇪", 1],
  ["TATA", "🇬🇧", 1],
  // level 3
  ["🇯🇵", "🏎️", 1],
  ["🇺🇸", "🏎️", 6],
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
  ["Tesla", "🇺🇸", 1],
  ["Chevrolet", "GM", 3],
  ["Pontiac", "GM", 1],
  ["Plymouth", "Fiat Chrysler Auto", 1],
  //     Other
  ["Porsche", "Volkswagen", 2],
  ["Jaguar", "TATA", 2],
  // level 2
  ["GM", "🇺🇸", 4],
  ["Fiat Chrysler Auto", "🇺🇸", 1],
  ["Volkswagen", "🇩🇪", 2],
  ["TATA", "🇬🇧", 2],
  // level 3
  ["🇯🇵", "🏎️", 2],
  ["🇺🇸", "🏎️", 9],
  ["🇩🇪", "🏎️", 2],
  ["🇬🇧", "🏎️", 2],
];
