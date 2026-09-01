import { amber, indigo, grey, red, yellow, teal } from "@mui/material/colors";
import dateObj, { type DateObj } from "../apis/DateHelper";

import prius07 from "../images/cars/07_toyota_prius.webp";
import voyager97 from "../images/cars/97_plymouth_voyager.webp";
import pontiac93 from "../images/cars/93_pontiac_bonneville.webp";
import impala10 from "../images/cars/10_chevrolet_impala.webp";
import equinox10 from "../images/cars/10_chevy_equinox.webp";
import mustang15 from "../images/cars/15_mustang_gt_premium.webp";
import tesla16 from "../images/cars/16_tesla_x.webp";
import xj8l05 from "../images/cars/05_jaguar_xj8l.webp";
import corvette18 from "../images/cars/18_corvette_zo6_3lz.webp";
import ftype15 from "../images/cars/15_jaguar_f_type.webp";
import mustang20 from "../images/cars/20_ford_mustang.webp";
import panamera21 from "../images/cars/21_porsche_panamera.webp";
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

const irene: CarEntry = {
  color: grey[400],
  start: dateObj("2010-12"),
  fStart: dateObj("2015-02"),
  end: dateObj("2015-06"),
  car: "Impala",
  nickname: "Irene",
  title: "Chevrolet Impala LS (2010)",
  inverted: true,
  src: impala10,
  transmission: "Automatic",

  horsepower: 211,
  MPG: 22,
  torque: 216,
  weight: 3555,
  zTo60: 8.3,
};

const tesla: CarEntry = {
  color: grey[50],
  start: dateObj("2016-03"),
  kStart: dateObj("2025-01"),
  end: dateObj("2025-06"),
  car: "Model X",
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

// --------------------------------------------------     Present Shared Cars     -------------------------------------------------- //

const camilla: CarEntry = {
  color: yellow[500],
  start: dateObj("2019-01"),
  fStart: dateObj("2021-10"),
  end: dateObj(),
  car: "Corvette",
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

const cheyenne: CarEntry = {
  color: grey[50],
  start: dateObj("2023-08"),
  fStart: dateObj("2025-01"),
  end: dateObj(),
  car: "Cayenne",
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
    color: amber[200],
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
    color: yellow[200],
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

const dateSort = (a: DateObj, b: DateObj) => a.diff(b, "months");

/** Sort by family timeline (`fStart`) or Ken timeline (`kStart`). */
const sortCarsByTimeline =
  (useFamilyDates: boolean) => (a: CarEntry, b: CarEntry) =>
    dateSort(
      useFamilyDates ? a.fStart || a.end : a.kStart || a.end,
      useFamilyDates ? b.fStart || b.end : b.kStart || b.end,
    );

export const cars: CarEntry[] = [
  ...pastKensCarsNoRepeats,
  ...currentKensCars,
  ...pastFamilyCarsNoRepeats,
  ...currentFamilyCars,
].sort((a: CarEntry, b: CarEntry) => dateSort(a.end, b.end));

const pastKensCars = [...pastKensCarsNoRepeats, camilla, cheyenne].sort(
  sortCarsByTimeline(true),
);
const pastFamilyCars = [...pastFamilyCarsNoRepeats, irene, tesla].sort(
  sortCarsByTimeline(false),
);
const hideFamilyCars = [...pastKensCars, ...currentKensCars].sort(
  sortCarsByTimeline(true),
);
const hideKenCars = [...pastFamilyCars, ...currentFamilyCars].sort(
  sortCarsByTimeline(false),
);

export {
  pastKensCars,
  currentKensCars,
  pastFamilyCars,
  currentFamilyCars,
  hideFamilyCars,
  hideKenCars,
};

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

/** Normalize to 0–100; avoids NaN when high === low (breaks Highcharts SVG). */
const smoothData = (cur: number, high: number, low: number): number => {
  if (
    !Number.isFinite(cur) ||
    !Number.isFinite(high) ||
    !Number.isFinite(low)
  ) {
    return 0;
  }
  if (high === low) {
    return 50;
  }
  return Math.floor(100 * ((cur - low) / (high - low)));
};

const CAR_METRICS = [
  "horsepower",
  "MPG",
  "torque",
  "weight",
  "zTo60",
] as const satisfies ReadonlyArray<keyof CarEntry>;

const getMinAndMax = (data: CarEntry[]) => {
  const min = {
    horsepower: data[0].horsepower,
    MPG: data[0].MPG,
    torque: data[0].torque,
    weight: data[0].weight,
    zTo60: data[0].zTo60,
    powerToWeight: data[0].horsepower / data[0].weight,
  };
  const max = { ...min };

  for (let i = 1; i < data.length; i += 1) {
    const car = data[i];
    const powerToWeight = car.horsepower / car.weight;

    for (const metric of CAR_METRICS) {
      const value = car[metric];
      if (value > max[metric]) {
        max[metric] = value;
      } else if (value < min[metric]) {
        min[metric] = value;
      }
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
    ret.zTo60.push([car.car, smoothData(car.zTo60, min.zTo60, max.zTo60)]);
    ret.powerToWeight.push([
      car.car,
      smoothData(powerToWeight, max.powerToWeight, min.powerToWeight),
    ]);
  });

  return ret;
};
