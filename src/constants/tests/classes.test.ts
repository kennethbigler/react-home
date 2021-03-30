import { getStart, getEnd } from '../classes';
import dateObj from '../../apis/DateHelper';

describe('constants classes', () => {
  let oldConsole: any;

  beforeAll(() => {
    oldConsole = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = oldConsole;
  });

  test('getStart', () => {
    // @ts-expect-error: testing default for getStart
    expect(getStart(null, 0).year).toEqual(dateObj().year);
    expect(console.error).toHaveBeenCalledWith('Start Error: quarter given does not exist: ', null);
  });

  test('getEnd', () => {
    // @ts-expect-error: testing default for getEnd
    expect(getEnd(null, 0).year).toEqual(dateObj().year);
    expect(console.error).toHaveBeenCalledWith('End Error: quarter given does not exist: ', null);
  });
});
