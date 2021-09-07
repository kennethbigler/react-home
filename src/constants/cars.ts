import indigo from '@material-ui/core/colors/indigo';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import lime from '@material-ui/core/colors/lime';
import yellow from '@material-ui/core/colors/yellow';
import teal from '@material-ui/core/colors/teal';

import dateObj from '../apis/DateHelper';

import prius07 from '../images/07_toyota_prius.jpg';
import pontiac93 from '../images/93_pontiac_bonneville.jpg';
import impala10 from '../images/10_chevrolet_impala_ls.jpg';
import equinox10 from '../images/10_chevy_equinox.png';
import mustang15 from '../images/15_mustang_gt_premium.png';
import tesla16 from '../images/16_tesla_x.webp';
import xj8l05 from '../images/05_jaguar_xj8l.jpg';
import corvette18 from '../images/18_corvette_zo6_3lz.png';
import ftype15 from '../images/15_jaguar_f_type.webp';
import mustang20 from '../images/20_ford_mustang.jpeg';
import panamera21 from '../images/21_porsche_panamera.png';
import bronco21 from '../images/21_ford_bronco.webp';

const prius = 'Toyota Prius (2007)';
const bonneville = 'Pontiac Bonneville (1993)';
const equinox = 'Chevy Equinox LTZ (2010)';
const impala = 'Chevrolet Impala LS (2010)';
const mustang = 'Ford Mustang GT Premium (2015)';
const tesla = 'Tesla Model X 90D (2016)';
const ftype = 'Jaguar F-Type R Convertible (2015)';
const xj8l = 'Jaguar XJ8-L (2005)';
const corvette = 'Chevrolet Corvette Z06 (2018)';
const mustang2 = 'Ford Mustang GT Premium (2020)';
const panamera = 'Porsche Panamera E-Hybrid (2021)';
const bronco = 'Ford Bronco Badlands (2021)';
// const trident = 'Triumph Trident 660 (2022)';

const familyCars = [
  {
    color: indigo[500],
    start: dateObj('2008-03'),
    end: dateObj('2016-08'),
    short: 'Prius',
    char: 'P',
    title: prius,

    owned: '2008 - 2016',
    story: `I learned to drive with a permit on my Father's ${prius}.`,
    src: prius07,
    transmission: 'Automatic',

    displacement: 1.5,
    horsepower: 110,
    MPG: 46,
    torque: 82,
    weight: 2932,
  }, {
    color: yellow[600],
    start: dateObj('2010-02'),
    end: dateObj(),
    short: 'Equinox',
    char: 'E',
    title: equinox,
    inverted: true,

    owned: '2010 - present',
    story: `My Mother's ${equinox}.`,
    src: equinox10,
    transmission: 'Automatic',

    displacement: 2.4,
    horsepower: 182,
    MPG: 26,
    torque: 172,
    weight: 3838,
  }, {
    color: grey[50],
    start: dateObj('2016-03'),
    end: dateObj(),
    short: 'Model X',
    char: 'X',
    title: tesla,
    inverted: true,

    owned: '2016 - present',
    story: `My Father's ${tesla}.`,
    src: tesla16,
    transmission: 'Direct',

    displacement: 0,
    horsepower: 417,
    MPG: 92,
    torque: 485,
    weight: 5271,
  }, {
    color: lime[800],
    start: dateObj('2017-10'),
    end: dateObj('2021-08'),
    short: 'XJ8-L',
    char: 'J',
    title: xj8l,

    owned: '2017 - 2021',
    story: `My Family's ${xj8l}.`,
    src: xj8l05,
    transmission: 'Automatic',

    displacement: 4.2,
    horsepower: 294,
    MPG: 19,
    torque: 303,
    weight: 3777,
  }, {
    color: indigo[900],
    start: dateObj('2020-03'),
    end: dateObj(),
    short: 'Mustang2',
    char: 'M2',
    nickname: 'Miranda Jr',
    title: mustang2,

    owned: '2020 - Present',
    story: `Emily purchased her first car, a ${mustang2} with the Performance Pack 1!`,
    src: mustang20,
    transmission: 'Manual',

    displacement: 5.0,
    horsepower: 460,
    MPG: 18,
    torque: 420,
    weight: 3705,
  }, {
    color: grey[50],
    start: dateObj('2021-08'),
    end: dateObj(),
    short: 'Panamera',
    char: 'PP',
    title: panamera,
    inverted: true,

    owned: '2021 - Present',
    story: `My Mother's ${panamera}.`,
    src: panamera21,
    transmission: 'Automatic',

    displacement: 2.9,
    horsepower: 455,
    MPG: 22,
    torque: 516,
    weight: 4967,
  },
];

const kensCars = [
  {
    color: grey[800],
    start: dateObj('2008-09'),
    end: dateObj('2010-12'),
    short: 'Bonneville',
    char: 'P',
    nickname: 'Petunia',
    title: bonneville,

    owned: '2008 - 2010',
    story: `I got my first car: a ${bonneville}. It was previously my grandfather's and I got it as my first car when I got my license.`,
    src: pontiac93,
    transmission: 'Automatic',

    displacement: 3.8,
    horsepower: 205,
    MPG: 18,
    torque: 260,
    weight: 3607,
  }, {
    color: grey[400],
    start: dateObj('2010-12'),
    end: dateObj('2015-06'),
    short: 'Impala',
    char: 'I',
    nickname: 'Irene',
    title: impala,
    inverted: true,

    owned: '2010 - 2015',
    story: `After selling my first car, my parents purchased a ${impala} for me to drive. It was a used Hertz rental car.`,
    src: impala10,
    transmission: 'Automatic',

    displacement: 3.5,
    horsepower: 211,
    MPG: 22,
    torque: 216,
    weight: 3555,
  }, {
    color: red[900],
    start: dateObj('2015-02'),
    end: dateObj('2019-01'),
    short: 'Mustang',
    char: 'M1',
    nickname: 'Miranda',
    title: mustang,

    owned: '2015 - 2019',
    story: `I purchased my first vehicle, a new ${mustang} with the 50 Years Edition Package. I did some modifications to this car including: `
      + 'Rear Window Louvers, GT350 start button, metal dead pedal, ergonomic parking break, Borla Ford Racing Sport Catback Exhaust, & Hurst automatic shift lever.',
    src: mustang15,
    transmission: 'Automatic',

    displacement: 5.0,
    horsepower: 435,
    MPG: 19,
    torque: 400,
    weight: 3705,
  }, {
    color: grey[50],
    start: dateObj('2018-03'),
    end: dateObj('2018-08'),
    short: 'F-Type',
    char: 'J',
    title: ftype,
    inverted: true,

    owned: '2018',
    story: `I rented a ${ftype} on Turo, which I wouldn't normally include in this list, but I totalled this car, so ended up having my insurance buy it! So I kind of owned it for one day.`,
    src: ftype15,
    transmission: 'Manual',

    displacement: 3.0,
    horsepower: 380,
    MPG: 22,
    torque: 339,
    weight: 3558,
  }, {
    color: yellow[500],
    start: dateObj('2019-01'),
    end: dateObj(),
    short: 'Corvette',
    char: 'C',
    nickname: 'Camilla',
    title: corvette,
    inverted: true,

    owned: '2019 - Present',
    story: `To replace my Mustang I purchased a ${corvette} 3LZ with the Z07 Track Package used from the Ron Fellows Performance Driving School.`,
    src: corvette18,
    transmission: 'Manual',

    displacement: 6.2,
    horsepower: 650,
    MPG: 18,
    torque: 650,
    weight: 3524,
  }, {
    color: teal[100],
    start: dateObj('2021-09'),
    end: dateObj(),
    short: 'Bronco',
    char: 'B',
    nickname: 'Betty',
    title: bronco,

    owned: '2021 - Present',
    story: `In an attempt to get a more practical daily driver, as well as dip my toes into the off-roading community, I purchased a ${bronco}.`,
    src: bronco21,
    transmission: 'Manual',

    displacement: 2.3,
    horsepower: 270,
    MPG: 18,
    torque: 310,
    weight: 4499,
  }, // {
  //   color: grey[100],
  //   start: dateObj('2021-09'),
  //   end: dateObj(),
  //   short: 'Trident',
  //   char: 'T',
  //   title: trident,
  //   inverted: true,

  //   owned: '2021 - Present',
  //   story: `motorcycle: ${trident}.`,
  //   src: bronco21,
  //   transmission: 'Manual',

  //   displacement: 0.66,
  //   horsepower: 80,
  //   MPG: 60,
  //   torque: 47,
  //   weight: 416.7,
  // },
];

familyCars.reverse();
kensCars.reverse();
const cars = [...kensCars, ...familyCars];

interface CarStats {
  displacement: number,
  horsepower: number,
  MPG: number,
  short: string,
  char: string,
  torque: number,
  weight: number,
}
export interface GraphData extends CarStats {
  powerToWeight: number;
}

const processData = (data: CarStats[]): GraphData[] => {
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
    const powerToWeight = data[i].horsepower / data[i].weight;

    (data[i].displacement > max.displacement && (max.displacement = data[i].displacement))
    || (data[i].displacement < min.displacement && (min.displacement = data[i].displacement));
    (data[i].horsepower > max.horsepower && (max.horsepower = data[i].horsepower))
    || (data[i].horsepower < min.horsepower && (min.horsepower = data[i].horsepower));
    (data[i].MPG > max.MPG && (max.MPG = data[i].MPG))
    || (data[i].MPG < min.MPG && (min.MPG = data[i].MPG));
    (data[i].torque > max.torque && (max.torque = data[i].torque))
    || (data[i].torque < min.torque && (min.torque = data[i].torque));
    (data[i].weight > max.weight && (max.weight = data[i].weight))
    || (data[i].weight < min.weight && (min.weight = data[i].weight));
    (powerToWeight > max.powerToWeight && (max.powerToWeight = powerToWeight))
    || (powerToWeight < min.powerToWeight && (min.powerToWeight = powerToWeight));
  }

  const ret: GraphData[] = [];

  // normalize the data to all fit on the same graph (0-1)
  data.forEach((car: CarStats) => {
    const powerToWeight = car.horsepower / car.weight;
    ret.push({
      displacement: (car.displacement - min.displacement) / (max.displacement - min.displacement),
      horsepower: (car.horsepower - min.horsepower) / (max.horsepower - min.horsepower),
      MPG: (car.MPG - min.MPG) / (max.MPG - min.MPG),
      short: car.short,
      char: car.char,
      torque: (car.torque - min.torque) / (max.torque - min.torque),
      weight: (car.weight - min.weight) / (max.weight - min.weight),
      powerToWeight: (powerToWeight - min.powerToWeight) / (max.powerToWeight - min.powerToWeight),
    });
  });

  return ret;
};

export const processedKensCars = processData(kensCars);
export const processedFamilyCars = processData(familyCars);
export const processedCars = processData(cars);
export { kensCars, familyCars };

export default cars;
