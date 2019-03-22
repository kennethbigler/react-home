import {
  amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow,
} from '@material-ui/core/colors/';
import reduce from 'lodash/reduce';

export const pennyPokerScores = [
  {
    name: 'Night 1',
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
    name: 'Night 2',
    Ken: -42,
    Aaron: -1,
    Jordan: 94,
    Lily: -131,
    Andy: -140,
    Mike: 220,
  }, {
    name: 'Night 3',
    Ken: -100,
    Jordan: -24,
    Lily: -45,
    Tom: 39,
    Meeks: 147,
  }, {
    name: 'Night 4',
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
    name: 'Night 5',
    Ken: 218,
    Lauren: -90,
    Aaron: 60,
    Jordan: 82,
    Lily: -70,
    Tom: -200,
  }, {
    name: 'Night 6',
    Ken: -33,
    Jordan: 46,
    Lily: -98,
    Keishi: -32,
    Andy: 27,
    Mike: 90,
  }, {
    name: 'Night 7',
    Ken: 187,
    Aaron: 14,
    Jordan: -46,
    Tom: -55,
    Gus: -100,
  }, {
    name: 'Night 8',
    Ken: 127,
    Aaron: -40,
    Jordan: 119,
    Gus: 16,
    Zach: -122,
    Scott: -100,
  }, {
    name: 'Night 9',
    Ken: 11,
    Jordan: 17,
    Andy: 30,
    Gus: -58,
  }, {
    name: 'Night 10',
    Ken: -23,
    Lauren: 58,
    Jordan: -20,
    Landon: -100,
    Lily: -100,
    Andy: 240,
    Tom: 9,
  }, {
    name: 'Night 11',
    Ken: 42,
    Aaron: -55,
    Jordan: 0,
    Tom: 38,
    Gus: -25,
  }, {
    name: 'Night 12',
    Ken: 57,
    Aaron: 34,
    Tom: 9,
    Gus: -100,
  },
];

export const pennyPokerColors = {
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

export const gigNowPokerScores = [
  {
    name: 'Night 1',
    Ken: 32.25,
    Sabik: 35.25,
    Avi: 15.50,
    Seb: -23,
    Jonathan: -20,
    Mike: -20,
    Brady: -20,
  }, {
    name: 'Night 2',
    Jonathan: -20,
    Seb: -40,
    Sabik: -20,
    Mike: 90,
    Brady: -20,
    'Michael A': 70,
    Carlos: -20,
    Matt: -20,
    Dhruven: -20,
  },
];

export const gigNowPokerColors = {
  Ken: amber[500],
  Jonathan: blue[500],
  Seb: blueGrey[500],
  Sabik: brown[500],
  Avi: cyan[500],
  Mike: deepOrange[500],
  Brady: deepPurple[500],
  'Michael A': green[500],
  Carlos: indigo[500],
  Matt: lightBlue[500],
  Dhruven: lightGreen[500],
};

function zeroOutData(people, scores) {
  const zeroes = reduce(people, (result, person, key) => {
    result[key] = 0;
    return result;
  }, {});
  scores.unshift(zeroes);
}

zeroOutData(pennyPokerColors, pennyPokerScores);
zeroOutData(gigNowPokerColors, gigNowPokerScores);
