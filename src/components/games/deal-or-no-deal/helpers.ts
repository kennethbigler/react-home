/** function that takes a number and returns string displayed like money */
export const getMoneyText = (n = 0): string => {
  const txt = n.toString().split("");
  const e = txt[0] === "-" ? 1 : 0;
  for (let i = txt.length - 3; i > e; i -= 3) {
    txt.splice(i, 0, ",");
  }
  txt.splice(e, 0, "$");
  return txt.join("");
};

export default getMoneyText;
