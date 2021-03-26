import { getStart, getEnd } from '../classes';
import dateObj from '../../apis/DateHelper';

describe('constants classes', () => {
  test('getStart', () => {
    // @ts-expect-error: testing default for getStart
    expect(getStart(null, 0).year).toEqual(dateObj().year);
  });

  test('getEnd', () => {
    // @ts-expect-error: testing default for getEnd
    expect(getEnd(null, 0).year).toEqual(dateObj().year);
  });
});
