async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    /* eslint no-await-in-loop: 0 */
    await callback(array[index], index, array);
  }
}

export default asyncForEach;
