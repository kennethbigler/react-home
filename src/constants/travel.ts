interface Country {
  name: string;
  continent: string;
  flag: string;
}

/** name is a unique key, verify it on https://unpkg.com/world-atlas@2.0.2/countries-110m.json */
const countries: Country[] = [
  { name: "American Samoa", continent: "AS", flag: "🇦🇸" },
  { name: "Antarctica", continent: "AQ", flag: "🇦🇶" },
  { name: "Argentina", continent: "SA", flag: "🇦🇷" },
  { name: "Australia", continent: "AU", flag: "🇦🇺" },
  { name: "Austria", continent: "EU", flag: "🇦🇹" },
  { name: "Bahamas", continent: "NA", flag: "🇧🇸" },
  // Dec '25? - { name: "Brazil", continent: "SA", flag: "🇧🇷" },
  { name: "British Virgin Islands", continent: "NA", flag: "🇻🇬" },
  { name: "Canada", continent: "NA", flag: "🇨🇦" },
  { name: "Cayman Islands", continent: "NA", flag: "🇰🇾" },
  { name: "Chile", continent: "SA", flag: "🇨🇱" },
  { name: "China", continent: "AS", flag: "🇨🇳" },
  // Apr '26 - { name: "Colombia", continent: "SA", flag: "🇨🇴" },
  { name: "Denmark", continent: "EU", flag: "🇩🇰" },
  { name: "Egypt", continent: "AF", flag: "🇪🇬" },
  { name: "Estonia", continent: "EU", flag: "🇪🇪" },
  { name: "Fiji", continent: "AS", flag: "🇫🇯" },
  { name: "Finland", continent: "EU", flag: "🇫🇮" },
  { name: "France", continent: "EU", flag: "🇫🇷" },
  { name: "Germany", continent: "EU", flag: "🇩🇪" },
  { name: "Gibraltar", continent: "EU", flag: "🇬🇮" },
  { name: "Greece", continent: "EU", flag: "🇬🇷" },
  { name: "Hong Kong", continent: "AS", flag: "🇭🇰" },
  { name: "Iceland", continent: "EU", flag: "🇮🇸" },
  { name: "India", continent: "AS", flag: "🇮🇳" },
  { name: "Ireland", continent: "EU", flag: "🇮🇪" },
  { name: "Italy", continent: "EU", flag: "🇮🇹" },
  { name: "Jamaica", continent: "NA", flag: "🇯🇲" },
  { name: "Japan", continent: "AS", flag: "🇯🇵" },
  { name: "Malta", continent: "EU", flag: "🇲🇹" },
  { name: "Mexico", continent: "NA", flag: "🇲🇽" },
  { name: "Monaco", continent: "EU", flag: "🇲🇨" },
  { name: "Morocco", continent: "AF", flag: "🇲🇦" },
  { name: "Netherlands", continent: "EU", flag: "🇳🇱" },
  { name: "New Caledonia", continent: "AS", flag: "🇳🇨" },
  { name: "Norway", continent: "EU", flag: "🇳🇴" },
  // Apr '26 - { name: "Panama", continent: "NA", flag: "🇵🇦" },
  { name: "Poland", continent: "EU", flag: "🇵🇱" },
  { name: "Portugal", continent: "EU", flag: "🇵🇹" },
  { name: "Puerto Rico", continent: "NA", flag: "🇵🇷" },
  { name: "Russia", continent: "EU", flag: "🇷🇺" },
  { name: "Spain", continent: "EU", flag: "🇪🇸" },
  { name: "Sweden", continent: "EU", flag: "🇸🇪" },
  { name: "Switzerland", continent: "EU", flag: "🇨🇭" },
  { name: "Turkey", continent: "EU", flag: "🇹🇷" },
  { name: "United Arab Emirates", continent: "AF", flag: "🇦🇪" },
  { name: "United Kingdom", continent: "EU", flag: "🇬🇧" },
  { name: "United States of America", continent: "NA", flag: "🇺🇸" },
  // Dec '25? - { name: "Uruguay", continent: "SA", flag: "🇺🇾" },
  { name: "U.S. Virgin Islands", continent: "NA", flag: "🇻🇮" },
  { name: "Vatican", continent: "EU", flag: "🇻🇦" },
];

export const americas: Country[] = [];
export const euNaf: Country[] = [];
export const asNau: Country[] = [];

countries.forEach((country): void => {
  switch (country.continent) {
    case "NA":
    case "SA":
      americas.push(country);
      break;
    case "EU":
    case "AF":
      euNaf.push(country);
      break;
    case "AS":
    case "AU":
    case "AQ":
    default:
      asNau.push(country);
  }
});

export const numCountries = countries.length;

export default countries;
