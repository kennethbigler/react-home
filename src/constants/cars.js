import prius07 from '../images/07_toyota_prius.jpg';
import pontiac93 from '../images/93_pontiac_bonneville.jpg';
import impala10 from '../images/10_chevrolet_impala_ls.jpg';
import mustang15 from '../images/15_mustang_gt_premium.jpg';
import jaguar05 from '../images/05_jaguar_xj8l.jpg';
import corvette18 from '../images/18_corvette_zo6_3lz.jpeg';

const cars = [
  {
    owned: '2008',
    story: 'The car I learned how to drive on while I had my driver\'s permit was my father\'s new 2007 Toyota Prius.',
    src: prius07,
    makeModel: '2007 Toyota Prius',
    transmission: 'Automatic',
    horsePower: 110,
  }, {
    owned: '2008 - 2011',
    story: 'I got my first car: a 1993 Pontiac Bonneville. It was previously my grandfather\'s (mother\'s side) and I got it as my first car when I got my license.',
    src: pontiac93,
    makeModel: '1993 Pontiac Bonneville',
    transmission: 'Automatic',
    horsePower: 205,
  }, {
    owned: '2011 - 2015',
    story: 'After selling my first car, my parents purchased a 2010 Chevrolet Impala LS for me to drive. It was a used Hertz rental car.',
    src: impala10,
    makeModel: '2010 Chevrolet Impala',
    transmission: 'Automatic',
    horsePower: 230,
  }, {
    owned: '2015 - 2019',
    story: 'I purchased my first vehicle, a new 2015 Ford Mustang GT Premium with the 50 Years Edition Package. I did some modifications to this car including: '
      + 'Rear Window Louvers, GT350 start button, metal dead pedal, ergonomic parking break, Borla Ford Racing Sport Catback Exhaust, & Hurst automatic shift lever',
    src: mustang15,
    makeModel: '2015 Ford Mustang GT Premium',
    transmission: 'Automatic',
    horsePower: 435,
  }, {
    owned: '2018 - Present',
    story: 'I sold my Mustang (as the exhaust was too loud), and started driving a 2005 Jaguar XJ8-L that my grandfather (father\'s side) had given to my family.',
    src: jaguar05,
    makeModel: '2005 Jaguar XJ8-L',
    transmission: 'Automatic',
    horsePower: 390,
  }, {
    owned: '2019 - Present',
    story: 'To replace my Mustang I purchased a 2018 Corvette Z06 3LZ with the Z07 Package used from the Ron Fellows Performance Driving School.',
    src: corvette18,
    makeModel: '2018 Chevrolet Corvette Z06 3LZ Z07 Package',
    transmission: 'Manual',
    horsePower: 650,
  },
];

export default cars;
