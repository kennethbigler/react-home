import {
  insertItem, updateObjectInArray, updateArrayInArray, removeItem, removeItemInArray,
} from './immutableHelpers';

describe('helpers | immutableHelpers', () => {
  test('insertItem', () => {
    expect(insertItem([1, 2, 3], 4)).toEqual([1, 2, 3, 4]);
  });

  test('updateObjectInArray', () => {
    expect(updateObjectInArray([{ id: 1 }, { id: 2 }, { id: 3 }], { id: 2, hello: 'world' }, 'id'))
      .toEqual([{ id: 1 }, { id: 2, hello: 'world' }, { id: 3 }]);
  });

  test('updateArrayInArray', () => {
    expect(updateArrayInArray([[1], [2], [3]], [2, 4], 1)).toEqual([[1], [2, 4], [3]]);
  });

  test('removeItem', () => {
    expect(removeItem([{ id: 1 }, { id: 2 }, { id: 3 }], 2)).toEqual([{ id: 1 }, { id: 3 }]);
  });

  test('removeItemInArray', () => {
    expect(removeItemInArray([1, 2, 3], 1)).toEqual([1, 3]);
  });
});
