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
import mustang15 from '../images/15_mustang_gt_premium.png';
import xj8l05 from '../images/05_jaguar_xj8l.jpg';
import corvette18 from '../images/18_corvette_zo6_3lz.png';
import ftype15 from '../images/15_jaguar_f_type.webp';
import mustang20 from '../images/20_ford_mustang.jpeg';
import bronco21 from '../images/21_ford_bronco.webp';

const prius = 'Toyota Prius (2007)';
const bonneville = 'Pontiac Bonneville (1993)';
const impala = 'Chevrolet Impala LS (2010)';
const mustang = 'Ford Mustang GT Premium (2015)';
const ftype = 'Jaguar F-Type R Convertible (2015)';
const xj8l = 'Jaguar XJ8-L (2005)';
const corvette = 'Chevrolet Corvette Z06 (2018)';
const mustang2 = 'Ford Mustang GT Premium (2020)';
const bronco = 'Ford Bronco Badlands (2021)';
// const honda = 'Honda Rebel 500 (2021)';

const cars = [
  {
    color: indigo[500],
    start: dateObj('2008-03'),
    end: dateObj('2008-09'),
    short: 'Prius',
    char: 'P',
    title: prius,

    owned: '2008',
    story: `The car I learned how to drive on while I had my driver's permit was my father's new ${prius}.`,
    src: prius07,
    transmission: 'Automatic',

    displacement: 1.5,
    horsepower: 110,
    MPG: 46,
    torque: 82,
    weight: 2932,
  }, {
    color: grey[800],
    start: dateObj('2008-09'),
    end: dateObj('2010-12'),
    short: 'Bonneville',
    char: 'P',
    nickname: 'Petunia',
    title: bonneville,

    owned: '2008 - 2010',
    story: `I got my first car: a ${bonneville}. It was previously my grandfather's (mother's side) and I got it as my first car when I got my license.`,
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
    end: dateObj('2015-02'),
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
      + 'Rear Window Louvers, GT350 start button, metal dead pedal, ergonomic parking break, Borla Ford Racing Sport Catback Exhaust, & Hurst automatic shift lever',
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
    color: lime[800],
    start: dateObj('2019-01'),
    end: dateObj('2019-07'),
    short: 'XJ8-L',
    char: 'J',
    title: xj8l,

    owned: '2019',
    story: `I sold my Mustang (as the exhaust was too loud), and started driving a ${xj8l} that my grandfather (father's side) had given to my family.`,
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
  //   short: 'Honda',
  //   char: 'H',
  //   title: honda,
  //   inverted: true,

  //   owned: '2021 - Present',
  //   story: `motorcycle: ${honda}.`,
  //   src: bronco21,
  //   transmission: 'Manual',

  //   displacement: 0.5,
  //   horsepower: 46,
  //   MPG: 67,
  //   torque: 32,
  //   weight: 408,
  // },
];

cars.reverse();

interface CarStats {
  displacement: number,
  horsepower: number,
  MPG: number,
  short: string,
  char: string,
  torque: number,
  weight: number,
}
interface GraphData extends CarStats {
  powerToWeight: number;
}

const processData = (data: CarStats[]): GraphData[] => {
  let maxDisplacement = cars[0].displacement;
  let maxHorsepower = cars[0].horsepower;
  let maxMPG = cars[0].MPG;
  let maxTorque = cars[0].torque;
  let maxWeight = cars[0].weight;
  let maxPowerToWeight = 0;
  let minDisplacement = cars[0].displacement;
  let minHorsepower = cars[0].horsepower;
  let minMPG = cars[0].MPG;
  let minTorque = cars[0].torque;
  let minWeight = cars[0].weight;
  let minPowerToWeight = 10000;

  data.forEach((car) => {
    const powerToWeight = car.horsepower / car.weight;
    maxDisplacement = (car.displacement > maxDisplacement) ? car.displacement : maxDisplacement;
    maxHorsepower = (car.horsepower > maxHorsepower) ? car.horsepower : maxHorsepower;
    maxMPG = (car.MPG > maxMPG) ? car.MPG : maxMPG;
    maxTorque = (car.torque > maxTorque) ? car.torque : maxTorque;
    maxWeight = (car.weight > maxWeight) ? car.weight : maxWeight;
    maxPowerToWeight = (powerToWeight > maxPowerToWeight) ? powerToWeight : maxPowerToWeight;

    minDisplacement = (car.displacement < minDisplacement) ? car.displacement : minDisplacement;
    minHorsepower = (car.horsepower < minHorsepower) ? car.horsepower : minHorsepower;
    minMPG = (car.MPG < minMPG) ? car.MPG : minMPG;
    minTorque = (car.torque < minTorque) ? car.torque : minTorque;
    minWeight = (car.weight < minWeight) ? car.weight : minWeight;
    minPowerToWeight = (powerToWeight < minPowerToWeight) ? powerToWeight : minPowerToWeight;
  });

  const ret: GraphData[] = [];

  data.forEach((car: CarStats) => {
    const powerToWeight = car.horsepower / car.weight;
    ret.push({
      displacement: (car.displacement - minDisplacement) / (maxDisplacement - minDisplacement),
      horsepower: (car.horsepower - minHorsepower) / (maxHorsepower - minHorsepower),
      MPG: (car.MPG - minMPG) / (maxMPG - minMPG),
      short: car.short,
      char: car.char,
      torque: (car.torque - minTorque) / (maxTorque - minTorque),
      weight: (car.weight - minWeight) / (maxWeight - minWeight),
      powerToWeight: (powerToWeight - minPowerToWeight) / (maxPowerToWeight - minPowerToWeight),
    });
  });

  return ret;
};

export const crunchedData = processData(cars);

export default cars;
