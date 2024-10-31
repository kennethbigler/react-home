import {
  indigo,
  grey,
  red,
  lime,
  yellow,
  teal,
  blue,
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
import xj8l05 from "../images/cars/05_jaguar_xj8l.jpg";
import corvette18 from "../images/cars/18_corvette_zo6_3lz.png";
import ftype15 from "../images/cars/15_jaguar_f_type.webp";
import mustang20 from "../images/cars/20_ford_mustang.png";
import panamera21 from "../images/cars/21_porsche_panamera.png";
import bronco21 from "../images/cars/21_ford_bronco.webp";
import grom22 from "../images/cars/22_honda_grom.webp";
import porsche19 from "../images/cars/19_porsche_cayenne.webp";

const prius = "Toyota Prius (2007)";
const voyager = "Plymouth Voyager (1997)";
const bonneville = "Pontiac Bonneville (1993)";
const equinox = "Chevrolet Equinox LTZ (2010)";
const impala = "Chevrolet Impala LS (2010)";
const mustang = "Ford Mustang GT Premium (2015)";
const tesla = "Tesla Model X 90D (2016)";
const ftype = "Jaguar F-Type R Convertible (2015)";
const xj8l = "Jaguar XJ8-L (2005)";
const corvette = "Chevrolet Corvette Z06 (2018)";
const mustangB = "Ford Mustang GT Premium (2020)";
const panamera = "Porsche Panamera E-Hybrid (2021)";
const bronco = "Ford Bronco Badlands (2021)";
const grom = "Honda Grom (2022)";
const cayenne = "Porsche Cayenne E-Hybrid (2019)";

// --------------------------------------------------     Cars     -------------------------------------------------- //

const pastFamilyCars = [
  {
    color: grey[50],
    start: dateObj("2008-03"),
    end: dateObj("2010-02"),
    car: "Voyager",
    short: "Voygr",
    char: "V",
    title: voyager,
    inverted: true,

    owned: "1997 - 2010",
    story: `My Mother had a ${voyager}.`,
    src: voyager97,
    transmission: "Automatic",

    displacement: 3.7,
    horsepower: 158,
    MPG: 21,
    torque: 203,
    weight: 3696,
  },
  {
    color: grey[400],
    start: dateObj("2015-02"),
    end: dateObj("2015-06"),
    car: "Impala",
    short: "Impla",
    char: "I",
    nickname: "Irene",
    title: impala,
    inverted: true,

    owned: "2010 - 2015",
    story: `My parents held on to the ${impala} for 4 months for my brother.`,
    src: impala10,
    transmission: "Automatic",

    displacement: 3.5,
    horsepower: 211,
    MPG: 22,
    torque: 216,
    weight: 3555,
  },
  {
    color: indigo[500],
    start: dateObj("2008-03"),
    end: dateObj("2016-08"),
    car: "Prius",
    short: "Prius",
    char: "P",
    title: prius,

    owned: "2008 - 2016",
    story: `I learned to drive with a permit on my Father's ${prius}.`,
    src: prius07,
    transmission: "Automatic",

    displacement: 1.5,
    horsepower: 110,
    MPG: 46,
    torque: 82,
    weight: 2932,
  },
  {
    color: lime[800],
    inverted: true,
    start: dateObj("2017-10"),
    end: dateObj("2021-08"),
    car: "Jag XJ8-L",
    short: "XJ8-L",
    char: "J",
    title: xj8l,

    owned: "2017 - 2021",
    story: `My Family's ${xj8l}.`,
    src: xj8l05,
    transmission: "Automatic",

    displacement: 4.2,
    horsepower: 294,
    MPG: 19,
    torque: 303,
    weight: 3777,
  },
  {
    color: indigo[900],
    start: dateObj("2020-03"),
    end: dateObj("2022-10"),
    car: "MustangB",
    short: "Mstng",
    char: "Mb",
    nickname: "Miranda Jr",
    title: mustangB,

    owned: "2020 - 2022",
    story: `I shared a ${mustangB} with the Performance Pack 1 with my roommate!`,
    src: mustang20,
    transmission: "Manual",

    displacement: 5.0,
    horsepower: 460,
    MPG: 18,
    torque: 420,
    weight: 3705,
  },
];

const currentFamilyCars = [
  {
    color: lime[800],
    inverted: true,
    start: dateObj("2010-02"),
    end: dateObj(),
    car: "Equinox",
    short: "Eqnox",
    char: "E",
    title: equinox,

    owned: "2010 - Present",
    story: `My Mother's ${equinox}.`,
    src: equinox10,
    transmission: "Automatic",

    displacement: 2.4,
    horsepower: 182,
    MPG: 26,
    torque: 172,
    weight: 3838,
  },
  {
    color: grey[50],
    start: dateObj("2016-03"),
    end: dateObj(),
    car: "Model X",
    short: "ModlX",
    char: "X",
    title: tesla,
    inverted: true,

    owned: "2016 - Present",
    story: `My Father's ${tesla}.`,
    src: tesla16,
    transmission: "Direct",

    displacement: 0,
    horsepower: 417,
    MPG: 92,
    torque: 485,
    weight: 5271,
  },
  {
    color: grey[50],
    start: dateObj("2021-08"),
    end: dateObj(),
    car: "Panamera",
    short: "Pnmra",
    char: "PP",
    title: panamera,
    inverted: true,

    owned: "2021 - Present",
    story: `My Mother's ${panamera}.`,
    src: panamera21,
    transmission: "Automatic",

    displacement: 2.9,
    horsepower: 455,
    MPG: 22,
    torque: 516,
    weight: 4967,
  },
  {
    color: yellow[500],
    start: dateObj("2021-10"),
    end: dateObj(),
    car: "Corvette",
    short: "Vette",
    char: "C",
    nickname: "Camilla",
    title: corvette,
    inverted: true,

    owned: "2021 - Present",
    story: `My parents purchased my ${corvette} 3LZ with the Z07 Track Package to keep it in the family.`,
    src: corvette18,
    transmission: "Manual",

    displacement: 6.2,
    horsepower: 650,
    MPG: 18,
    torque: 650,
    weight: 3524,
  },
];

const pastKensCars = [
  {
    color: grey[800],
    start: dateObj("2008-03"),
    end: dateObj("2010-12"),
    car: "Bonneville",
    short: "Bonne",
    char: "P",
    nickname: "Petunia",
    title: bonneville,

    owned: "2008 - 2010",
    story: `I got my first car: a ${bonneville}. It was previously my grandfather's and I got it as my first car when I got my license.`,
    src: pontiac93,
    transmission: "Automatic",

    displacement: 3.8,
    horsepower: 205,
    MPG: 18,
    torque: 260,
    weight: 3607,
  },
  {
    color: grey[400],
    start: dateObj("2010-12"),
    end: dateObj("2015-02"),
    car: "Impala",
    short: "Impla",
    char: "I",
    nickname: "Irene",
    title: impala,
    inverted: true,

    owned: "2010 - 2015",
    story: `After selling my first car, my parents purchased a ${impala} for me to drive. It was a used Hertz rental car.`,
    src: impala10,
    transmission: "Automatic",

    displacement: 3.5,
    horsepower: 211,
    MPG: 22,
    torque: 216,
    weight: 3555,
  },
  {
    color: red[900],
    start: dateObj("2015-02"),
    end: dateObj("2019-01"),
    car: "Mustang",
    short: "Mstng",
    char: "M1",
    nickname: "Miranda",
    title: mustang,

    owned: "2015 - 2019",
    story:
      `I purchased my first vehicle, a new ${mustang} with the 50 Years Edition Package. I did some modifications to this car including: ` +
      "Rear Window Louvers, GT350 start button, metal dead pedal, ergonomic parking break, Borla Ford Racing Sport Catback Exhaust, & Hurst automatic shift lever.",
    src: mustang15,
    transmission: "Automatic",

    displacement: 5.0,
    horsepower: 435 + 15,
    MPG: 19,
    torque: 400,
    weight: 3705,
  },
  {
    color: grey[50],
    start: dateObj("2018-03"),
    end: dateObj("2018-08"),
    car: "Jag F-Type",
    short: "FType",
    char: "J",
    title: ftype,
    inverted: true,

    owned: "2018",
    story: `I rented a ${ftype} on Turo, which I wouldn't normally include in this list, but I totalled this car, so ended up having my insurance buy it! So I kind of owned it for one day.`,
    src: ftype15,
    transmission: "Manual",

    displacement: 3.0,
    horsepower: 380,
    MPG: 22,
    torque: 339,
    weight: 3558,
  },
  {
    color: yellow[500],
    start: dateObj("2019-01"),
    end: dateObj("2021-10"),
    car: "Corvette",
    short: "Vette",
    char: "C",
    nickname: "Camilla",
    title: corvette,
    inverted: true,

    owned: "2019 - 2021",
    story: `To replace my Mustang I purchased a ${corvette} 3LZ with the Z07 Track Package used from the Ron Fellows Performance Driving School. I sold it to my parents.`,
    src: corvette18,
    transmission: "Manual",

    displacement: 6.2,
    horsepower: 650,
    MPG: 18,
    torque: 650,
    weight: 3524,
  },
  {
    color: teal[100],
    start: dateObj("2021-10"),
    end: dateObj("2023-03"),
    car: "Bronco",
    short: "Brnco",
    char: "B",
    nickname: "Betty",
    title: bronco,
    inverted: true,

    owned: "2021 - 2023",
    story: `In an attempt to get a more practical daily driver, as well as dip my toes into the off-roading community, I purchased a ${bronco}.`,
    src: bronco21,
    transmission: "Manual",

    displacement: 2.3,
    horsepower: 270,
    MPG: 18,
    torque: 310,
    weight: 4499,
  },
  {
    color: yellow[500],
    start: dateObj("2023-03"),
    end: dateObj("2023-08"),
    car: "Corvette",
    short: "Vette",
    char: "C",
    nickname: "Camilla",
    title: corvette,
    inverted: true,

    owned: "2023",
    story: `I borrowed the corvette again for a few months.`,
    src: corvette18,
    transmission: "Manual",

    displacement: 6.2,
    horsepower: 650,
    MPG: 18,
    torque: 650,
    weight: 3524,
  },
];

const currentKensCars = [
  {
    color: grey[900],
    start: dateObj("2022-04"),
    end: dateObj(),
    car: "Grom",
    short: "Grom",
    char: "G",
    title: grom,

    owned: "2022 - Present",
    story: `motorcycle: ${grom}.`,
    src: grom22,
    transmission: "Sequential",

    displacement: 0.124,
    horsepower: parseFloat((9.7 * 1.139).toPrecision(3)),
    MPG: 130,
    torque: parseFloat((7.7 * 1.143).toPrecision(3)),
    weight: 230,
  },
  {
    color: grey[50],
    start: dateObj("2023-08"),
    end: dateObj(),
    car: "Cayenne",
    short: "Cyne",
    char: "C",
    nickname: "Cheyenne",
    title: cayenne,
    inverted: true,

    owned: "2023 - Present",
    story: `I bought a plug-in hybrid Cayenne as a bit of an upgrade to my old Bronco.`,
    src: porsche19,
    transmission: "Automatic",

    displacement: 3.0,
    horsepower: 455,
    MPG: 46,
    torque: 516,
    weight: 5060,
  },
];

const cars = [
  ...pastKensCars,
  ...currentKensCars,
  ...pastFamilyCars,
  ...currentFamilyCars,
];

export default cars;

// --------------------------------------------------     Normalized Graphs     -------------------------------------------------- //

export interface CarStats {
  displacement: number;
  horsepower: number;
  MPG: number;
  car: string;
  char: string;
  torque: number;
  weight: number;
}
type HighChartsData = [string, number];
interface GraphData {
  xAxis: string[];
  displacement: HighChartsData[];
  horsepower: HighChartsData[];
  MPG: HighChartsData[];
  torque: HighChartsData[];
  weight: HighChartsData[];
  powerToWeight: HighChartsData[];
}

const smoothData = (cur: number, high: number, low: number) =>
  Math.floor(100 * ((cur - low) / (high - low)));

export const processData = (data: CarStats[]): GraphData => {
  const ret: GraphData = {
    xAxis: [],
    displacement: [],
    horsepower: [],
    MPG: [],
    torque: [],
    weight: [],
    powerToWeight: [],
  };

  if (data.length === 0) {
    return ret;
  }

  const max = {
    displacement: data[0].displacement,
    horsepower: data[0].horsepower,
    MPG: data[0].MPG,
    torque: data[0].torque,
    weight: data[0].weight,
    powerToWeight: data[0].horsepower / data[0].weight,
  };
  const min = { ...max };

  // find the min and max values in the array
  for (let i = 1; i < data.length; i += 1) {
    const { horsepower, displacement, MPG, torque, weight } = data[i];
    const powerToWeight = horsepower / weight;

    if (displacement > max.displacement) {
      max.displacement = displacement;
    } else if (displacement < min.displacement) {
      min.displacement = displacement;
    }
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
    if (powerToWeight > max.powerToWeight) {
      max.powerToWeight = powerToWeight;
    } else if (powerToWeight < min.powerToWeight) {
      min.powerToWeight = powerToWeight;
    }
  }

  // normalize the data to all fit on the same graph (0-1)
  data.forEach((car: CarStats) => {
    const powerToWeight = car.horsepower / car.weight;
    ret.xAxis.push(car.char);
    ret.displacement.push([
      car.car,
      smoothData(car.displacement, max.displacement, min.displacement),
    ]);
    ret.horsepower.push([
      car.car,
      smoothData(car.horsepower, max.horsepower, min.horsepower),
    ]);
    ret.MPG.push([car.car, smoothData(car.MPG, max.MPG, min.MPG)]);
    ret.torque.push([car.car, smoothData(car.torque, max.torque, min.torque)]);
    ret.weight.push([car.car, smoothData(car.weight, max.weight, min.weight)]);
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

const getP2W = (c: CarStats) =>
  parseFloat((c.horsepower / c.weight).toFixed(3));

export const processCurrentCarStats = (
  data: CarStats[],
  key:
    | "displacement"
    | "horsepower"
    | "MPG"
    | "torque"
    | "weight"
    | "powerToWeight",
): CurrentCarStatsData => {
  const currentValue =
    key === "powerToWeight"
      ? getP2W(currentKensCars[1])
      : currentKensCars[1][key];

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
    name: currentKensCars[1].car,
  };
};

export { pastKensCars, currentKensCars, pastFamilyCars, currentFamilyCars };

// --------------------------------------------------     Sankey     -------------------------------------------------- //

export const carSankeyNodes = [
  { id: "🏎️", color: grey[200] },
  // level 1
  { id: "🇯🇵", color: red[500], column: 2 },
  { id: "🇺🇸", color: blue[500], column: 2 },
  { id: "🇩🇪", color: orange[500], column: 2 },
  { id: "🇬🇧", color: grey[300], column: 2 },
  // level 2
  { id: "GM", color: blue[500], offset: 70 },
  { id: "Fiat Chrysler Auto", color: blue[500], offset: 70 },
  { id: "Volkswagen", color: orange[500], offset: 70 },
  { id: "TATA", color: grey[300], offset: 70 },
  // level 3
  { id: "Chevrolet", color: yellow[700] },
  { id: "Pontiac", color: red[500] },
  { id: "Plymouth", color: "black" },
  { id: "Ford", color: blue[500] },
  { id: "Tesla", color: red[500] },
  { id: "Honda", color: red[500] },
  { id: "Toyota", color: red[500] },
  { id: "Porsche", color: yellow[700] },
  { id: "Jaguar", color: grey[300] },
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
  ["Porsche", "Volkswagen", 1],
  ["Jaguar", "TATA", 1],
  // level 2
  ["GM", "🇺🇸", 3],
  ["Fiat Chrysler Auto", "🇺🇸", 1],
  ["Volkswagen", "🇩🇪", 1],
  ["TATA", "🇬🇧", 1],
  // level 3
  ["🇯🇵", "🏎️", 1],
  ["🇺🇸", "🏎️", 6],
  ["🇩🇪", "🏎️", 1],
  ["🇬🇧", "🏎️", 1],
];

export const kenSankeyData = [
  // level 1
  //     Japan
  ["Honda", "🇯🇵", 1],
  //     US
  ["Ford", "🇺🇸", 2],
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
  ["🇺🇸", "🏎️", 5],
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
