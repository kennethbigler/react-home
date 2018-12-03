import map from 'lodash/map';
import reject from 'lodash/reject';

// Immutable helper functions
export function insertItem(array, item) {
  const newArr = array.slice();
  newArr.push(item);
  return newArr;
}

export function updateObjectInArray(array, ins, key) {
  return map(
    array,
    item => (item[key] !== ins[key] ? item : { ...item, ...ins }),
  );
}

export function updateArrayInArray(array, ins, idx) {
  return map(array, (player, i) => (i !== idx ? player : ins));
}

export function removeItem(array, id) {
  return reject(array, ['id', id]);
}

export function removeItemInArray(array, idx) {
  return [...array.slice(0, idx), ...array.slice(idx + 1)];
}
