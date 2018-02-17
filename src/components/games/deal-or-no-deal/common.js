export const getMoneyText = n => {
  let txt = n.toString().split('');
  for (let i = txt.length - 3; i > 0; i -= 3) {
    txt.splice(i, 0, ',');
  }
  return `$${txt.join('')}`;
};
