import map from 'lodash/map';
import reject from 'lodash/reject';

// Immutable helper functions
export function insertItem(array: any[], item: any): any[] {
  const newArr = array.slice();
  newArr.push(item);
  return newArr;
}

export function updateObjectInArray(array: any[], ins: any, key: string | number): any[] {
  return map(
    array,
    (item) => (item[key] !== ins[key] ? item : { ...item, ...ins }),
  );
}

export function updateArrayInArray(array: any[], ins: any, idx: number): any[] {
  return map(array, (item, i) => (i !== idx ? item : ins));
}

export function removeItem(array: any[], id: number): any {
  return reject(array, ['id', id]);
}

export function removeItemInArray(array: any[], idx: number): any[] {
  return [...array.slice(0, idx), ...array.slice(idx + 1)];
}
