/** use the usDollar.format() function to format a number into a USD string */
const usDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default usDollar;
