import { atom, selector } from "recoil";

/** Compensation Calculator
 *
 * -----     SALARY     -----
 * Date {string}
 * Salary {number}
 * Bonus {number}
 * Stock (Adj) {number} - calculated
 * Stock {number} - calculated
 * Total {number} - calculated
 * Total (Adj) {number} - calculated
 * Net {number} - calculated
 *
 * -----     STOCK     -----
 * Price Now {number} - number (V1) - API (V2)
 * Price Then {number} - number (V1) - API (V2)
 * Grant Qty {number} - STOCKS
 * Grant Duration {number} - YEARS
 * Grant Then - calculated
 * Grant Now - calculated
 */
export interface CompEntry {
  entryDate: string;
  salary: number;
  bonus: number;
  priceNow: number;
  priceThen: number;
  grantDuration: number; // YEARS
  grantQty: number; // STOCKS
}

export interface CompCalcEntry {
  stock: number;
  stockAdj: number;
  total: number;
  totalAdj: number;
  netDiff: number;
  grantThen: number;
  grantNow: number;
}

export type CompCalcState = CompEntry[];

export const compCalcAtom = atom({
  key: "compCalcAtom",
  default:
    (JSON.parse(
      localStorage.getItem("comp-calc-atom") || "null",
    ) as CompCalcState) || [],
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("comp-calc-atom", JSON.stringify(state));
      });
    },
  ],
});

export const compCalcReadOnlyState = selector({
  key: "compCalcReadOnlyState",
  get: ({ get }) => {
    // access state
    const compEntries = get(compCalcAtom);

    const compCalcEntriesNoNet: Omit<CompCalcEntry, "netDiff">[] =
      compEntries.map(
        ({ salary, bonus, priceNow, priceThen, grantDuration, grantQty }) => {
          const stock = (priceThen * grantQty) / grantDuration;
          const stockAdj = (priceNow * grantQty) / grantDuration;
          const total = salary + bonus + stock;
          const totalAdj = salary + bonus + stockAdj;
          const grantThen = priceThen * grantQty;
          const grantNow = priceNow * grantQty;

          return {
            stock,
            stockAdj,
            total,
            totalAdj,
            grantThen,
            grantNow,
          };
        },
      );

    const compCalcEntries: CompCalcEntry[] = compCalcEntriesNoNet.map(
      ({ totalAdj, ...rest }, i) => {
        const netDiff =
          i === 0 ? 0 : totalAdj - compCalcEntriesNoNet[i - 1].totalAdj;

        return {
          totalAdj,
          netDiff,
          ...rest,
        };
      },
    );

    return compCalcEntries;
  },
});

export default compCalcAtom;
