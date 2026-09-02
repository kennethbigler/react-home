import { amber, grey, indigo, orange, red, yellow } from "@mui/material/colors";

const CAR_SANKEY_DESTINATION = {
  id: "🏎️",
  column: 0,
  order: 0,
  color: grey[200],
} as const;

const CAR_COUNTRIES = {
  de: { flag: "🇩🇪", order: 0, color: orange[500] },
  gb: { flag: "🇬🇧", order: 1, color: grey[100] },
  us: { flag: "🇺🇸", order: 2, color: indigo[900] },
  jp: { flag: "🇯🇵", order: 3, color: red[500] },
} as const;

const CAR_PARENTS = {
  Volkswagen: { order: 0, color: orange[500] },
  TATA: { order: 1, color: indigo[500] },
  GM: { order: 2, color: yellow[700] },
  Stellantis: { order: 3, color: grey[50] },
} as const;

/**
 * Brand column — `parent` set ⇒ 4-tier path (country → parent → brand);
 * omitted ⇒ 3-tier (country → brand).
 *
 * Keys match the first word of each car's `title` (e.g. `Tesla Model X …`).
 */
const CAR_BRANDS = {
  Porsche: {
    country: "de",
    parent: "Volkswagen",
    order: 0,
    color: orange[500],
  },
  Jaguar: {
    country: "gb",
    parent: "TATA",
    order: 1,
    color: red[900],
  },
  Chevrolet: {
    country: "us",
    parent: "GM",
    order: 2,
    color: yellow[700],
  },
  Pontiac: {
    country: "us",
    parent: "GM",
    order: 3,
    color: red[500],
  },
  Plymouth: {
    country: "us",
    parent: "Stellantis",
    order: 4,
    color: grey[50],
  },
  Ford: { country: "us", order: 5, color: indigo[900] },
  Rivian: { country: "us", order: 6, color: amber[500] },
  Tesla: { country: "us", order: 7, color: red[500] },
  Honda: { country: "jp", order: 8, color: red[500] },
  Toyota: { country: "jp", order: 9, color: indigo[400] },
} as const;

type CarBrandId = keyof typeof CAR_BRANDS;
type CarParentId = keyof typeof CAR_PARENTS;

export type CarSankeyLink = [from: string, to: string, weight: number];

interface CarSankeyNode {
  id: string;
  color: string;
  column: number;
  order: number;
}

const SANKEY_COLUMN = {
  destination: 0,
  country: 1,
  parent: 2,
  brand: 3,
} as const;

const CAR_BRAND_IDS = new Set<string>(Object.keys(CAR_BRANDS));

const getBrandFromTitle = (title: string): CarBrandId => {
  const firstWord = title.trim().split(/\s+/)[0];
  if (CAR_BRAND_IDS.has(firstWord)) {
    return firstWord as CarBrandId;
  }
  throw new Error(`Unknown car brand "${firstWord}" in title: ${title}`);
};

const getSankeyLinksForBrand = (
  brandId: CarBrandId,
  weight = 1,
): CarSankeyLink[] => {
  const brand = CAR_BRANDS[brandId];
  const country = CAR_COUNTRIES[brand.country];
  const links: CarSankeyLink[] = [
    [CAR_SANKEY_DESTINATION.id, country.flag, weight],
  ];

  if ("parent" in brand && brand.parent) {
    const parentId = brand.parent;
    links.push([country.flag, parentId, weight]);
    links.push([parentId, brandId, weight]);
  } else {
    links.push([country.flag, brandId, weight]);
  }

  return links;
};

const linkKey = (from: string, to: string) => `${from}\0${to}`;

/** Aggregate Sankey links from car titles (brand parsed from the first word). */
export const buildCarSankeyFromCars = (
  entries: ReadonlyArray<{ title: string }>,
): CarSankeyLink[] => {
  const weights = new Map<string, number>();

  for (const { title } of entries) {
    for (const [from, to, weight] of getSankeyLinksForBrand(
      getBrandFromTitle(title),
    )) {
      const key = linkKey(from, to);
      weights.set(key, (weights.get(key) ?? 0) + weight);
    }
  }

  return [...weights.entries()].map(([key, weight]) => {
    const [from, to] = key.split("\0");
    return [from, to, weight] as CarSankeyLink;
  });
};

/** Static node layout for the car Sankey (independent of which cars are shown). */
export const buildCarSankeyNodes = (): CarSankeyNode[] => [
  {
    id: CAR_SANKEY_DESTINATION.id,
    color: CAR_SANKEY_DESTINATION.color,
    column: SANKEY_COLUMN.destination,
    order: CAR_SANKEY_DESTINATION.order,
  },
  ...Object.values(CAR_COUNTRIES).map((country) => ({
    id: country.flag,
    color: country.color,
    column: SANKEY_COLUMN.country,
    order: country.order,
  })),
  ...(
    Object.entries(CAR_PARENTS) as [
      CarParentId,
      (typeof CAR_PARENTS)[CarParentId],
    ][]
  ).map(([id, parent]) => ({
    id,
    color: parent.color,
    column: SANKEY_COLUMN.parent,
    order: parent.order,
  })),
  ...(
    Object.entries(CAR_BRANDS) as [
      CarBrandId,
      (typeof CAR_BRANDS)[CarBrandId],
    ][]
  ).map(([id, brand]) => ({
    id,
    color: brand.color,
    column: SANKEY_COLUMN.brand,
    order: brand.order,
  })),
];
