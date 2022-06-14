interface Country {
  continent: string;
  flag: string;
  code: string;
}
export type Countries = Record<string, Country>;

const countries: Countries = {
  Austria: { continent: "EU", flag: "🇦🇹", code: "at" },
  Bahamas: { continent: "NA", flag: "🇧🇸", code: "bs" },
  Canada: { continent: "NA", flag: "🇨🇦", code: "ca" },
  Denmark: { continent: "EU", flag: "🇩🇰", code: "dk" },
  Estonia: { continent: "EU", flag: "🇪🇪", code: "ee" },
  Finland: { continent: "EU", flag: "🇫🇮", code: "fi" },
  France: { continent: "EU", flag: "🇫🇷", code: "fr" },
  Germany: { continent: "EU", flag: "🇩🇪", code: "de" },
  Greece: { continent: "EU", flag: "🇬🇷", code: "gr" },
  Iceland: { continent: "EU", flag: "🇮🇸", code: "is" },
  Ireland: { continent: "EU", flag: "🇮🇪", code: "ie" },
  Italy: { continent: "EU", flag: "🇮🇹", code: "it" },
  Jamaica: { continent: "NA", flag: "🇯🇲", code: "jm" },
  Mexico: { continent: "NA", flag: "🇲🇽", code: "mx" },
  Netherlands: { continent: "EU", flag: "🇳🇱", code: "nl" },
  Norway: { continent: "EU", flag: "🇳🇴", code: "no" },
  Poland: { continent: "EU", flag: "🇵🇱", code: "pl" },
  Portugal: { continent: "EU", flag: "🇵🇹", code: "pt" },
  Russia: { continent: "EU", flag: "🇷🇺", code: "ru" },
  Spain: { continent: "EU", flag: "🇪🇸", code: "es" },
  Sweden: { continent: "EU", flag: "🇸🇪", code: "se" },
  Switzerland: { continent: "EU", flag: "🇨🇭", code: "ch" },
  Turkey: { continent: "EU", flag: "🇹🇷", code: "tr" },
  "United Kingdom": { continent: "EU", flag: "🇬🇧", code: "gb" },
  "United States of America": { continent: "NA", flag: "🇺🇸", code: "us" },
  "British Virgin Islands": { continent: "NA", flag: "🇻🇬", code: "vg" },
  "Cayman Islands": { continent: "NA", flag: "🇰🇾", code: "ky" },
  "U.S. Virgin Islands": { continent: "NA", flag: "🇻🇮", code: "vi" },
  Gibraltar: { continent: "EU", flag: "🇬🇮", code: "gi" },
  Malta: { continent: "EU", flag: "🇲🇹", code: "mt" },
  Monaco: { continent: "EU", flag: "🇲🇨", code: "mc" },
  Vatican: { continent: "EU", flag: "🇻🇦", code: "va" },
};

export const NA: string[] = [];
export const EU: string[] = [];

Object.entries(countries).forEach(([name, country]): void => {
  country.continent === "NA" && NA.push(`${name} ${country.flag}`);
  country.continent === "EU" && EU.push(`${name} ${country.flag}`);
});

export default countries;
