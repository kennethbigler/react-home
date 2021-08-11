import indigo from '@material-ui/core/colors/indigo';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import lime from '@material-ui/core/colors/lime';
import yellow from '@material-ui/core/colors/yellow';

import dateObj from '../apis/DateHelper';

import prius07 from '../images/07_toyota_prius.jpg';
import pontiac93 from '../images/93_pontiac_bonneville.jpg';
import impala10 from '../images/10_chevrolet_impala_ls.jpg';
import mustang15 from '../images/15_mustang_gt_premium.png';
import xj8l05 from '../images/05_jaguar_xj8l.jpg';
import corvette18 from '../images/18_corvette_zo6_3lz.png';
import ftype15 from '../images/15_jaguar_f_type.webp';
import mustang20 from '../images/20_ford_mustang.jpeg';

const prius = 'Toyota Prius (2007)';
const bonneville = 'Pontiac Bonneville (1993)';
const impala = 'Chevrolet Impala LS (2010)';
const mustang = 'Ford Mustang GT Premium (2015)';
const ftype = 'Jaguar F-Type R Convertible (2015)';
const xj8l = 'Jaguar XJ8-L (2005)';
const corvette = 'Chevrolet Corvette Z06 (2018)';
const mustang2 = 'Ford Mustang GT Premium (2020)';

const cars = [
  {
    color: indigo[500],
    start: dateObj('2008-03'),
    end: dateObj('2008-09'),
    short: 'Prius',
    title: prius,

    owned: '2008',
    story: `The car I learned how to drive on while I had my driver's permit was my father's new ${prius}.`,
    src: prius07,
    transmission: 'Automatic',
    horsePower: 110,
  }, {
    color: grey[800],
    start: dateObj('2008-09'),
    end: dateObj('2010-12'),
    short: 'Bonneville',
    title: bonneville,

    owned: '2008 - 2010',
    story: `I got my first car: a ${bonneville}. It was previously my grandfather's (mother's side) and I got it as my first car when I got my license.`,
    src: pontiac93,
    transmission: 'Automatic',
    horsePower: 205,
  }, {
    color: grey[400],
    start: dateObj('2010-12'),
    end: dateObj('2015-02'),
    short: 'Impala',
    title: impala,
    inverted: true,

    owned: '2010 - 2015',
    story: `After selling my first car, my parents purchased a ${impala} for me to drive. It was a used Hertz rental car.`,
    src: impala10,
    transmission: 'Automatic',
    horsePower: 230,
  }, {
    color: red[900],
    start: dateObj('2015-02'),
    end: dateObj('2019-01'),
    short: 'Mustang',
    title: mustang,

    owned: '2015 - 2019',
    story: `I purchased my first vehicle, a new ${mustang} with the 50 Years Edition Package. I did some modifications to this car including: `
      + 'Rear Window Louvers, GT350 start button, metal dead pedal, ergonomic parking break, Borla Ford Racing Sport Catback Exhaust, & Hurst automatic shift lever',
    src: mustang15,
    transmission: 'Automatic',
    horsePower: 435,
  }, {
    color: grey[50],
    start: dateObj('2018-03'),
    end: dateObj('2018-08'),
    short: 'F-Type',
    title: ftype,
    inverted: true,

    owned: '2018',
    story: `I rented a ${ftype} on Turo, which I wouldn't normally include in this list, but I totalled this car, so ended up having my insurance buy it! So I kind of owned it for one day.`,
    src: ftype15,
    transmission: 'Manual',
    horsePower: 550,
  }, {
    color: lime[800],
    start: dateObj('2019-01'),
    end: dateObj('2019-07'),
    short: 'XJ8-L',
    title: xj8l,

    owned: '2019',
    story: `I sold my Mustang (as the exhaust was too loud), and started driving a ${xj8l} that my grandfather (father's side) had given to my family.`,
    src: xj8l05,
    transmission: 'Automatic',
    horsePower: 390,
  }, {
    color: indigo[900],
    start: dateObj('2020-03'),
    end: dateObj(),
    short: 'Mustang2',
    title: mustang2,

    owned: '2020 - Present',
    story: `Emily purchased her first car, a ${mustang2} with the Performance Pack 1!`,
    src: mustang20,
    transmission: 'Manual',
    horsePower: 460,
  }, {
    color: yellow[500],
    start: dateObj('2019-01'),
    end: dateObj(),
    short: 'Corvette',
    title: corvette,
    inverted: true,

    owned: '2019 - Present',
    story: `To replace my Mustang I purchased a ${corvette} 3LZ with the Z07 Track Package used from the Ron Fellows Performance Driving School.`,
    src: corvette18,
    transmission: 'Manual',
    horsePower: 650,
  },
];

cars.reverse();

export default cars;
