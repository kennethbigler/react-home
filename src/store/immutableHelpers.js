import map from 'lodash/map';
import reject from 'lodash/reject';

// Immutable helper functions
export function insertItem(array, item) {
  let newArr = array.slice();
  newArr.push(item);
  return newArr;
}

export function updateObjectInArray(array, ins, key) {
  return map(array, (item) => {
    return item[key] !== ins[key] ? item : {...item, ...ins};
  });
}

export function updateArrayInArray(array, ins, idx) {
  return map(array, (player, i) => {
    return i !== idx ? player : ins;
  });
}

export function removeItem(array, id) {
  return reject(array, ['id', id]);
}
