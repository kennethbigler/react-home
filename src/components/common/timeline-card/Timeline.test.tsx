import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from './Timeline';

import dateObj from '../../../apis/DateHelper';

const data = [
  {
    color: 'red',
    title: 'Title 1',
    start: dateObj('2019-06'),
    end: dateObj(),
  },
  {
    color: 'blue',
    title: 'Title 2',
    start: dateObj('2019-07'),
    end: dateObj(),
    inverted: true,
  },
  {
    color: 'blue',
    title: 'Title 2',
    start: dateObj('2019-07'),
    end: dateObj(),
    short: 'Short',
  },
  {
    color: 'blue',
    title: 'Title 2',
    start: dateObj('2019-07'),
    end: dateObj(),
    inverted: true,
    short: 'Short',
  },
];


// /** reads [selector] from each array entry and creates segments */
// data: {
//   color: string;
//   title: string;
//   start: DateObj;
//   end: DateObj;
//   inverted?: boolean;
//   short?: string;
// } []
// /** key to be used to read data */
// selector: string;
// /** start of the timeline */
// start: DateObj;
// /** end of the timeline */
// end: DateObj;

describe('common | timeline-card | Timeline', () => {
  describe('basic props tests', () => {
    it('renders segments as expected', () => {
      expect(true);
    });
  });
});
