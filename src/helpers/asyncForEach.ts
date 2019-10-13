async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index += 1) {
    /* eslint-disable no-await-in-loop */
    await callback(array[index], index, array);
    /* eslint-enable no-await-in-loop */
  }
}

export default asyncForEach;
