import { green, yellow } from "@mui/material/colors";

interface Country {
  name: string;
  continent: string;
  flag: string;
  color: string;
}

/** name is a unique key, verify it on https://unpkg.com/world-atlas@2.0.2/countries-110m.json */
const countries: Country[] = [
  { name: "American Samoa", continent: "AS", flag: "🇦🇸", color: green[500] },
  { name: "Antarctica", continent: "SA", flag: "🇦🇶", color: green[500] },
  { name: "Argentina", continent: "SA", flag: "🇦🇷", color: green[500] },
  { name: "Australia", continent: "AU", flag: "🇦🇺", color: green[500] },
  { name: "Austria", continent: "EU", flag: "🇦🇹", color: yellow[500] },
  { name: "Bahamas", continent: "NA", flag: "🇧🇸", color: green[500] },
  { name: "Brazil", continent: "SA", flag: "🇧🇷", color: yellow[500] },
  {
    name: "British Virgin Islands",
    continent: "NA",
    flag: "🇻🇬",
    color: green[500],
  },
  { name: "Canada", continent: "NA", flag: "🇨🇦", color: green[500] },
  { name: "Cayman Islands", continent: "NA", flag: "🇰🇾", color: green[500] },
  { name: "Chile", continent: "SA", flag: "🇨🇱", color: yellow[500] },
  { name: "China", continent: "AS", flag: "🇨🇳", color: green[500] },
  // Apr '26 - { name: "Colombia", continent: "SA", flag: "🇨🇴", color: green[500] },
  { name: "Denmark", continent: "EU", flag: "🇩🇰", color: green[500] },
  { name: "Egypt", continent: "AF", flag: "🇪🇬", color: green[500] },
  { name: "Estonia", continent: "EU", flag: "🇪🇪", color: green[500] },
  { name: "Fiji", continent: "AS", flag: "🇫🇯", color: green[500] },
  { name: "Finland", continent: "EU", flag: "🇫🇮", color: green[500] },
  { name: "France", continent: "EU", flag: "🇫🇷", color: green[500] },
  { name: "Germany", continent: "EU", flag: "🇩🇪", color: green[500] },
  { name: "Gibraltar", continent: "EU", flag: "🇬🇮", color: green[500] },
  { name: "Greece", continent: "EU", flag: "🇬🇷", color: green[500] },
  { name: "Hong Kong", continent: "AS", flag: "🇭🇰", color: green[500] },
  { name: "Iceland", continent: "EU", flag: "🇮🇸", color: green[500] },
  { name: "India", continent: "AS", flag: "🇮🇳", color: green[500] },
  { name: "Ireland", continent: "EU", flag: "🇮🇪", color: green[500] },
  { name: "Italy", continent: "EU", flag: "🇮🇹", color: green[500] },
  { name: "Jamaica", continent: "NA", flag: "🇯🇲", color: green[500] },
  { name: "Japan", continent: "AS", flag: "🇯🇵", color: green[500] },
  { name: "Malta", continent: "EU", flag: "🇲🇹", color: green[500] },
  { name: "Mexico", continent: "NA", flag: "🇲🇽", color: green[500] },
  { name: "Monaco", continent: "EU", flag: "🇲🇨", color: green[500] },
  { name: "Morocco", continent: "AF", flag: "🇲🇦", color: green[500] },
  { name: "Netherlands", continent: "EU", flag: "🇳🇱", color: green[500] },
  { name: "New Caledonia", continent: "AS", flag: "🇳🇨", color: green[500] },
  { name: "Norway", continent: "EU", flag: "🇳🇴", color: green[500] },
  // Apr '26 - { name: "Panama", continent: "NA", flag: "🇵🇦", color: yellow[500] },
  { name: "Poland", continent: "EU", flag: "🇵🇱", color: green[500] },
  { name: "Portugal", continent: "EU", flag: "🇵🇹", color: green[500] },
  { name: "Puerto Rico", continent: "NA", flag: "🇵🇷", color: green[500] },
  { name: "Russia", continent: "EU", flag: "🇷🇺", color: green[500] },
  { name: "Spain", continent: "EU", flag: "🇪🇸", color: green[500] },
  { name: "Sweden", continent: "EU", flag: "🇸🇪", color: green[500] },
  { name: "Switzerland", continent: "EU", flag: "🇨🇭", color: green[500] },
  { name: "Turkey", continent: "EU", flag: "🇹🇷", color: green[500] },
  {
    name: "United Arab Emirates",
    continent: "AF",
    flag: "🇦🇪",
    color: yellow[500],
  },
  { name: "United Kingdom", continent: "EU", flag: "🇬🇧", color: green[500] },
  {
    name: "United States of America",
    continent: "NA",
    flag: "🇺🇸",
    color: green[500],
  },
  {
    name: "U.S. Virgin Islands",
    continent: "NA",
    flag: "🇻🇮",
    color: green[500],
  },
  { name: "Vatican", continent: "EU", flag: "🇻🇦", color: green[500] },
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

interface TravelDay {
  year: number;
  vacation: number;
  work: number;
}

const travelDays: TravelDay[] = [
  {
    year: 2020,
    vacation: 4,
    work: 0,
  },
  {
    year: 2021,
    vacation: 47,
    work: 0,
  },
  {
    year: 2022,
    vacation: 41,
    work: 33,
  },
  {
    year: 2023,
    vacation: 66,
    work: 11,
  },
  {
    year: 2024,
    vacation: 84,
    work: 23,
  },
  {
    year: 2025,
    vacation: 78,
    work: 34,
  },
  {
    year: 2026,
    vacation: 3,
    work: 0,
  },
];

export const vacationDays: number[] = travelDays.map((day) => day.vacation);
export const workDays: number[] = travelDays.map((day) => day.work);

export default countries;
