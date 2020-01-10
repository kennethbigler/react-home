declare module 'react-simple-maps';

interface GeographyProperties {
  NAME: string;
  NAME_LONG: string;
  ABBREV: string;
  FORMAL_EN: string;
  POP_EST: number;
  POP_RANK: number;
  GDP_MD_EST: number;
  POP_YEAR: number;
  GDP_YEAR: number;
  ISO_A2: string;
  ISO_A3: string;
  CONTINENT: string;
  REGION_UN: string;
  SUBREGION: string;
}
interface GeometryProperties {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: [number, number][];
}

declare interface GeographyType {
  geometry: GeometryProperties;
  type: 'Feature';
  properties: GeographyProperties;
}
