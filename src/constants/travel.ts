import { green, yellow } from "@mui/material/colors";

interface Country {
  name: string;
  continent: string;
  flag: string;
  color: string;
}

const color = green[500]; // visited
const t = yellow[500]; // tentatively visited

/** name is a unique key, verify it on https://unpkg.com/world-atlas@2.0.2/countries-110m.json */
const countries: Country[] = [
  { name: "American Samoa", continent: "AS", flag: "🇦🇸", color },
  { name: "Antarctica", continent: "AS", flag: "🇦🇶", color },
  { name: "Argentina", continent: "SA", flag: "🇦🇷", color },
  { name: "Australia", continent: "AU", flag: "🇦🇺", color },
  { name: "Austria", continent: "EU", flag: "🇦🇹", color: t },
  { name: "Bahamas", continent: "NA", flag: "🇧🇸", color },
  { name: "Brazil", continent: "SA", flag: "🇧🇷", color: t },
  { name: "British Virgin Islands", continent: "NA", flag: "🇻🇬", color },
  { name: "Canada", continent: "NA", flag: "🇨🇦", color },
  { name: "Cayman Islands", continent: "NA", flag: "🇰🇾", color },
  { name: "Chile", continent: "SA", flag: "🇨🇱", color: t },
  { name: "China", continent: "AS", flag: "🇨🇳", color },
  { name: "Colombia", continent: "SA", flag: "🇨🇴", color },
  { name: "Denmark", continent: "EU", flag: "🇩🇰", color },
  { name: "Egypt", continent: "AF", flag: "🇪🇬", color },
  { name: "Estonia", continent: "EU", flag: "🇪🇪", color },
  { name: "Fiji", continent: "AS", flag: "🇫🇯", color },
  { name: "Finland", continent: "EU", flag: "🇫🇮", color },
  { name: "France", continent: "EU", flag: "🇫🇷", color },
  { name: "Germany", continent: "EU", flag: "🇩🇪", color },
  { name: "Gibraltar", continent: "EU", flag: "🇬🇮", color },
  { name: "Greece", continent: "EU", flag: "🇬🇷", color },
  { name: "Hong Kong", continent: "AS", flag: "🇭🇰", color },
  { name: "Iceland", continent: "EU", flag: "🇮🇸", color },
  { name: "India", continent: "AS", flag: "🇮🇳", color },
  { name: "Ireland", continent: "EU", flag: "🇮🇪", color },
  { name: "Italy", continent: "EU", flag: "🇮🇹", color },
  { name: "Jamaica", continent: "NA", flag: "🇯🇲", color },
  { name: "Japan", continent: "AS", flag: "🇯🇵", color },
  { name: "Malta", continent: "EU", flag: "🇲🇹", color },
  { name: "Mexico", continent: "NA", flag: "🇲🇽", color },
  { name: "Monaco", continent: "EU", flag: "🇲🇨", color },
  { name: "Morocco", continent: "AF", flag: "🇲🇦", color },
  { name: "Netherlands", continent: "EU", flag: "🇳🇱", color },
  { name: "New Caledonia", continent: "AS", flag: "🇳🇨", color },
  { name: "Norway", continent: "EU", flag: "🇳🇴", color },
  { name: "Panama", continent: "NA", flag: "🇵🇦", color: t },
  { name: "Poland", continent: "EU", flag: "🇵🇱", color },
  { name: "Portugal", continent: "EU", flag: "🇵🇹", color },
  { name: "Puerto Rico", continent: "NA", flag: "🇵🇷", color },
  { name: "Russia", continent: "EU", flag: "🇷🇺", color },
  { name: "Spain", continent: "EU", flag: "🇪🇸", color },
  { name: "Sweden", continent: "EU", flag: "🇸🇪", color },
  { name: "Switzerland", continent: "EU", flag: "🇨🇭", color },
  { name: "Turkey", continent: "EU", flag: "🇹🇷", color },
  { name: "United Arab Emirates", continent: "AF", flag: "🇦🇪", color: t },
  { name: "United Kingdom", continent: "EU", flag: "🇬🇧", color },
  { name: "United States of America", continent: "NA", flag: "🇺🇸", color },
  { name: "U.S. Virgin Islands", continent: "NA", flag: "🇻🇮", color },
  { name: "Vatican", continent: "EU", flag: "🇻🇦", color },
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
  { year: 2016, vacation: 45, work: 3 },
  { year: 2017, vacation: 41, work: 3 },
  { year: 2018, vacation: 61, work: 6 },
  { year: 2019, vacation: 61, work: 0 },
  { year: 2020, vacation: 4, work: 0 },
  { year: 2021, vacation: 47, work: 0 },
  { year: 2022, vacation: 41, work: 33 },
  { year: 2023, vacation: 66, work: 11 },
  { year: 2024, vacation: 84, work: 23 },
  { year: 2025, vacation: 78, work: 34 },
  {
    // updated 10/1
    year: 2026,
    vacation: 72,
    work: 14,
  },
];

export const vacationDays: number[] = travelDays.map((day) => day.vacation);
export const workDays: number[] = travelDays.map((day) => day.work);

export default countries;
