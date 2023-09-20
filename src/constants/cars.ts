import { indigo, grey, red, lime, yellow, teal } from "@mui/material/colors";
import dateObj from "../apis/DateHelper";

import prius07 from "../images/07_toyota_prius.png";
import voyager97 from "../images/97_plymouth_voyager.png";
import pontiac93 from "../images/93_pontiac_bonneville.webp";
import impala10 from "../images/10_chevrolet_impala.webp";
import equinox10 from "../images/10_chevy_equinox.png";
import mustang15 from "../images/15_mustang_gt_premium.png";
import tesla16 from "../images/16_tesla_x.webp";
import xj8l05 from "../images/05_jaguar_xj8l.jpg";
import corvette18 from "../images/18_corvette_zo6_3lz.png";
import ftype15 from "../images/15_jaguar_f_type.webp";
import mustang20 from "../images/20_ford_mustang.png";
import panamera21 from "../images/21_porsche_panamera.png";
import bronco21 from "../images/21_ford_bronco.webp";
import grom22 from "../images/22_honda_grom.webp";
import porsche19 from "../images/19_porsche_cayenne.webp";

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

const familyCars = [
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

const kensCars = [
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
    MPG: 97,
    torque: parseFloat((7.7 * 1.143).toPrecision(3)),
    weight: 230,
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
  {
    color: grey[50],
    start: dateObj("2023-08"),
    end: dateObj(),
    car: "Cayenne",
    short: "Cyne",
    char: "C",
    nickname: "Petunia",
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

familyCars.reverse();
kensCars.reverse();
const cars = [...kensCars, ...familyCars];

export interface CarStats {
  displacement: number;
  horsepower: number;
  MPG: number;
  car: string;
  char: string;
  torque: number;
  weight: number;
}
export interface GraphData extends CarStats {
  powerToWeight: number;
}

const kWeight = 245;

export const processData = (data: CarStats[]): GraphData[] => {
  if (data.length === 0) {
    return [];
  }

  const max = {
    displacement: data[0].displacement,
    horsepower: data[0].horsepower,
    MPG: data[0].MPG,
    torque: data[0].torque,
    weight: data[0].weight + kWeight,
    powerToWeight: data[0].horsepower / (data[0].weight + kWeight),
  };
  const min = { ...max };

  // find the min and max values in the array
  for (let i = 1; i < data.length; i += 1) {
    const {
      horsepower,
      displacement,
      MPG,
      torque,
      weight: dryWeight,
    } = data[i];
    const weight = dryWeight + kWeight;
    const powerToWeight = horsepower / weight;

    (displacement > max.displacement && (max.displacement = displacement)) ||
      (displacement < min.displacement && (min.displacement = displacement));
    (horsepower > max.horsepower && (max.horsepower = horsepower)) ||
      (horsepower < min.horsepower && (min.horsepower = horsepower));
    (MPG > max.MPG && (max.MPG = MPG)) || (MPG < min.MPG && (min.MPG = MPG));
    (torque > max.torque && (max.torque = torque)) ||
      (torque < min.torque && (min.torque = torque));
    (weight > max.weight && (max.weight = weight)) ||
      (weight < min.weight && (min.weight = weight));
    (powerToWeight > max.powerToWeight &&
      (max.powerToWeight = powerToWeight)) ||
      (powerToWeight < min.powerToWeight &&
        (min.powerToWeight = powerToWeight));
  }

  const ret: GraphData[] = [];

  // normalize the data to all fit on the same graph (0-1)
  data.forEach((car: CarStats) => {
    const powerToWeight = car.horsepower / car.weight;
    ret.push({
      displacement:
        (car.displacement - min.displacement) /
        (max.displacement - min.displacement),
      horsepower:
        (car.horsepower - min.horsepower) / (max.horsepower - min.horsepower),
      MPG: (car.MPG - min.MPG) / (max.MPG - min.MPG),
      car: car.car,
      char: car.char,
      torque: (car.torque - min.torque) / (max.torque - min.torque),
      weight: (car.weight - min.weight) / (max.weight - min.weight),
      powerToWeight:
        (powerToWeight - min.powerToWeight) /
        (max.powerToWeight - min.powerToWeight),
    });
  });

  return ret;
};

export const processedKensCars = processData(kensCars);
export const processedFamilyCars = processData(familyCars);
export const processedCars = processData(cars);
export { kensCars, familyCars };

export const carSankeyData = {
  nodes: [
    { name: "🏎️" },
    // level 1
    { name: "🇺🇸" },
    { name: "🇯🇵" },
    { name: "🇩🇪" },
    { name: "🇬🇧" },
    // level 2
    { name: "GM" }, // US 5
    { name: "Chrysler" },
    { name: "Ford" },
    { name: "Tesla" },
    { name: "Toyota" }, // Japan 9
    { name: "Honda" },
    { name: "Volkswagen" }, // Germany 11
    { name: "Jaguar Land Rover" }, // UK 12
    // level 3
    // { name: "Pontiac" }, // 13
    // { name: "Chevrolet" },
    // { name: "Plymouth" },
    // { name: "Porsche" }, // 16
    // { name: "Jaguar" }, // 17
  ],
  links: [
    // level 1
    { source: 0, target: 1, value: 9 }, // US
    { source: 0, target: 2, value: 2 }, // Japan
    { source: 0, target: 3, value: 2 }, // UK
    { source: 0, target: 4, value: 2 }, // Germany
    // level 2
    //     US
    { source: 1, target: 5, value: 4 }, // GM
    { source: 1, target: 6, value: 1 }, // Chrysler
    { source: 1, target: 7, value: 3 }, // Ford
    { source: 1, target: 8, value: 1 }, // Tesla
    //     Japan
    { source: 2, target: 9, value: 1 }, // Toyota
    { source: 2, target: 10, value: 1 }, // Honda
    //     Other
    { source: 3, target: 11, value: 2 }, // JLR
    { source: 4, target: 12, value: 2 }, // VW
    // level 3
    // { source: 5, target: 13, value: 1 }, // Pontiac
    // { source: 5, target: 14, value: 3 }, // Chevy
    // { source: 6, target: 15, value: 1 }, // Plymouth
    // { source: 11, target: 16, value: 2 }, // Jaguar
    // { source: 12, target: 17, value: 2 }, // Porsche
  ],
};

export default cars;
