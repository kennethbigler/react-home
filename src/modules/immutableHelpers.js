// Immutable helper functions
export function insertItem(array, item) {
  let newArr = array.slice();
  newArr.push(item);
  return newArr;
}

export function updateObjectInArray(array, ins, key) {
  return array.map(item => {
    return item[key] !== ins[key] ? item : { ...item, ...ins };
  });
}

export function updateArrayInArray(array, ins, idx) {
  return array.map((player, i) => {
    return i !== idx ? player : ins;
  });
}

export function removeItem(array, id) {
  return array.filter(item => item.id !== id);
}
