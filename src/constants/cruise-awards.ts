/**
 * Cruise Critic U.S. awards, 2023–2025.
 *
 * Each chart is one category. Place 0 is the editors' pick. Places 1–3 are
 * Cruisers' Choice ranks from member reviews. A line can hold both in the
 * same year, so those are two points in the line's brand color.
 *
 * Cruisers' Choice ranked ships, not lines, before 2023, so these charts
 * start with the first cruise-line rankings. 2023 "Best Ocean" is the Best
 * Large Ship line (2,000+ guests).
 */

interface CruiseRankSeries {
  name: string;
  color: string;
  award: "editors" | "cruisers";
  data: (number | null)[];
}

export interface CruiseRankChart {
  id: string;
  title: string;
  caption: string;
  years: number[];
  /** Y-axis places. 0 is the editors' pick and sits above 1. */
  ranks: number[];
  series: CruiseRankSeries[];
}

interface LineAwards {
  name: string;
  color: string;
  /** Years the editors named this line their pick. */
  editors?: number[];
  /** Cruisers' Choice place by year. */
  cruisers?: Record<number, number>;
}

const EDITORS_PLACE = 0;

// Brand colors. Dark navy primaries use the line's brighter official blue
// so the series stays visible on the dark theme.
const AMA = "#00A0E4";
const AQUA = "#00A3A1";
const AVALON = "#E87722";
const CARNIVAL = "#E03A3E";
const CELEBRITY = "#3D6A99"; // Celebrity navy #002859, lifted so the line reads
const CRYSTAL = "#1F4E79";
const DISNEY = "#FF0100";
const EMERALD = "#00965E";
const EXPLORA = "#8D6E63";
const LINDBLAD = "#FFCC00"; // National Geographic yellow
const MARGARITAVILLE = "#F37021";
const MSC = "#3F51B5"; // MSC navy #000033 is nearly black; this is the compass blue
const PRINCESS = "#2E86C1"; // Princess blue #00538B, lifted
const QUARK = "#E85D04";
const QUASAR = "#2E7D32";
const RITZ = "#B4975A";
const ROYAL_CARIBBEAN = "#0073BB";
const SILVERSEA = "#7D8B99";
const VIKING = "#B10A32";
const VIRGIN = "#CC0000";

const PLACES = [EDITORS_PLACE, 1, 2, 3];
const EDITORS_ONLY = [EDITORS_PLACE];

const lastRank = (data: (number | null)[]): number => {
  for (let i = data.length - 1; i >= 0; i -= 1) {
    const rank = data[i];
    if (typeof rank === "number") return rank;
  }
  return Number.POSITIVE_INFINITY;
};

const rankChart = (
  id: string,
  title: string,
  caption: string,
  years: number[],
  ranks: number[],
  lines: LineAwards[],
): CruiseRankChart => {
  const series: CruiseRankSeries[] = [];

  lines.forEach((line) => {
    const editorYears = new Set(line.editors ?? []);
    if (editorYears.size > 0) {
      series.push({
        name: line.name,
        color: line.color,
        award: "editors",
        data: years.map((year) =>
          editorYears.has(year) ? EDITORS_PLACE : null,
        ),
      });
    }

    if (line.cruisers) {
      const data = years.map((year) => line.cruisers?.[year] ?? null);
      if (data.some((rank) => typeof rank === "number")) {
        series.push({
          name: line.name,
          color: line.color,
          award: "cruisers",
          data,
        });
      }
    }
  });

  // Higher places draw first so place 0 paints on top, matching F1.
  series.sort(
    (a, b) =>
      lastRank(b.data) - lastRank(a.data) || a.name.localeCompare(b.name),
  );

  return { id, title, caption, years, ranks, series };
};

const recentYears = [2023, 2024, 2025];

const combinedCaption =
  "Place 0 is the editors' pick. Places 1–3 are Cruisers' Choice ranks. The same line can hold both in one year.";

export const cruiseAwardCharts: CruiseRankChart[] = [
  rankChart(
    "ocean",
    "Best Ocean Cruise Line",
    `${combinedCaption} The editors' overall ocean award starts in 2024. Cruisers' Choice in 2023 is the Best Large Ship line (2,000 or more guests); 2024 and 2025 rank every ocean line.`,
    [2023, 2024, 2025],
    PLACES,
    [
      {
        name: "Royal Caribbean",
        color: ROYAL_CARIBBEAN,
        editors: [2024],
      },
      {
        name: "Virgin Voyages",
        color: VIRGIN,
        editors: [2025],
        cruisers: { 2023: 1, 2024: 2, 2025: 2 },
      },
      {
        name: "Celebrity Cruises",
        color: CELEBRITY,
        cruisers: { 2023: 2, 2024: 3, 2025: 3 },
      },
      { name: "Princess Cruises", color: PRINCESS, cruisers: { 2023: 3 } },
      {
        name: "Margaritaville at Sea",
        color: MARGARITAVILLE,
        cruisers: { 2024: 1, 2025: 1 },
      },
    ],
  ),
  rankChart(
    "luxury",
    "Best Luxury Cruise Line",
    `${combinedCaption} Cruisers' Choice luxury line ranks start in 2024.`,
    recentYears,
    PLACES,
    [
      {
        name: "Crystal",
        color: CRYSTAL,
        cruisers: { 2024: 1 },
      },
      { name: "Silversea", color: SILVERSEA, editors: [2023] },
      {
        name: "Explora Journeys",
        color: EXPLORA,
        editors: [2024, 2025],
        cruisers: { 2024: 2, 2025: 2 },
      },
      { name: "Viking", color: VIKING, cruisers: { 2024: 3, 2025: 1 } },
      {
        name: "Ritz-Carlton Yacht Collection",
        color: RITZ,
        cruisers: { 2025: 3 },
      },
    ],
  ),
  rankChart(
    "river",
    "Best River Cruise Line",
    `${combinedCaption} Cruisers' Choice river line ranks start in 2023.`,
    recentYears,
    PLACES,
    [
      {
        name: "Viking",
        color: VIKING,
        editors: [2023],
        cruisers: { 2023: 1, 2024: 3, 2025: 2 },
      },
      {
        name: "AmaWaterways",
        color: AMA,
        editors: [2024],
        cruisers: { 2023: 3 },
      },
      {
        name: "Avalon Waterways",
        color: AVALON,
        editors: [2025],
        cruisers: { 2024: 1, 2025: 1 },
      },
      {
        name: "Emerald Cruises",
        color: EMERALD,
        cruisers: { 2023: 2, 2024: 2, 2025: 3 },
      },
    ],
  ),
  rankChart(
    "families",
    "Best for Families",
    "Editors' pick for Best for Families, shown at place 0. Cruisers' Choice does not publish a matching cruise-line ranking for this category.",
    recentYears,
    EDITORS_ONLY,
    [
      {
        name: "Disney Cruise Line",
        color: DISNEY,
        editors: [2023, 2024],
      },
      { name: "MSC Cruises", color: MSC, editors: [2025] },
    ],
  ),
  rankChart(
    "value",
    "Best Value for Money",
    "Editors' pick for Best Value for Money, shown at place 0. Cruisers' Choice does not publish a matching cruise-line ranking for this category.",
    recentYears,
    EDITORS_ONLY,
    [
      {
        name: "Carnival Cruise Line",
        color: CARNIVAL,
        editors: [2023, 2024, 2025],
      },
    ],
  ),
  rankChart(
    "expedition",
    "Best Expedition Cruise Line",
    `${combinedCaption} Both awards cover 2024 and 2025, the years Cruise Critic ranked expedition lines.`,
    [2024, 2025],
    PLACES,
    [
      {
        name: "Lindblad Expeditions",
        color: LINDBLAD,
        editors: [2024, 2025],
        cruisers: { 2024: 3 },
      },
      { name: "Viking", color: VIKING, cruisers: { 2024: 1 } },
      {
        name: "Quark Expeditions",
        color: QUARK,
        cruisers: { 2024: 2, 2025: 3 },
      },
      { name: "Aqua Expeditions", color: AQUA, cruisers: { 2025: 1 } },
      { name: "Quasar Expeditions", color: QUASAR, cruisers: { 2025: 2 } },
    ],
  ),
];
