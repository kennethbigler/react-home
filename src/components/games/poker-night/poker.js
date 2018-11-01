import {
  amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow,
} from '@material-ui/core/colors/';
import reduce from 'lodash/reduce';

const scores = [
  {
    name: 'Week 1',
    Ken: 5,
    Lauren: -83,
    Aaron: -45,
    Winston: -17,
    Jordan: -25,
    Landon: -27,
    Lily: 3,
    Keishi: 209,
    Andy: -22,
  }, {
    name: 'Week 2',
    Ken: -42,
    Aaron: -1,
    Jordan: 94,
    Lily: -131,
    Andy: -140,
    Mike: 220,
  }, {
    name: 'Week 3',
    Ken: -100,
    Jordan: -24,
    Lily: -45,
    Tom: 39,
    Meeks: 147,
  }, {
    name: 'Week 4',
    Ken: 62,
    Aaron: -33,
    Jordan: 35,
    Lily: 179,
    Keishi: 15,
    Mike: 220,
    Tom: -100,
    Sam: 17,
    Gus: -14,
    Ashley: -14,
    Geoff: -100,
    Ming: -100,
  }, {
    name: 'Week 5',
    Ken: 218,
    Lauren: -90,
    Aaron: 60,
    Jordan: 82,
    Lily: -70,
    Tom: -200,
  }, {
    name: 'Week 6',
    Ken: -33,
    Jordan: 46,
    Lily: -98,
    Keishi: -32,
    Andy: 27,
    Mike: 90,
  }, {
    name: 'Week 7',
    Ken: 187,
    Aaron: 14,
    Jordan: -46,
    Tom: -55,
    Gus: -100,
  }, {
    name: 'Week 8',
    Ken: 127,
    Aaron: -40,
    Jordan: 119,
    Gus: 16,
    Zach: -122,
    Scott: -100,
  }, {
    name: 'Week 9',
    Ken: 11,
    Jordan: 17,
    Andy: 30,
    Gus: -58,
  }, {
    name: 'Week 10',
    Ken: -23,
    Lauren: 58,
    Jordan: -20,
    Landon: -100,
    Lily: -100,
    Andy: 240,
    Tom: 9,
  }, {
    name: 'Week 11',
    Ken: 42,
    Aaron: -55,
    Jordan: 0,
    Tom: 38,
    Gus: -25,
  },
];

export const colors = {
  Ken: amber[500],
  Lauren: blue[500],
  Aaron: blueGrey[500],
  Winston: brown[500],
  Jordan: cyan[500],
  Landon: deepOrange[500],
  Lily: deepPurple[500],
  Keishi: green[500],
  Andy: indigo[500],
  Mike: lightBlue[500],
  Tom: lightGreen[500],
  Meeks: lime[500],
  Sam: orange[500],
  Gus: pink[500],
  Ashley: purple[500],
  Geoff: red[500],
  Ming: teal[500],
  Zach: yellow[500],
  Scott: grey[500],
  Emily: grey[900],
};

const zeroes = reduce(colors, (result, val, key) => {
  result[key] = 0;
  return result;
}, {});
console.log(zeroes);
scores.unshift(zeroes);

export default scores;
