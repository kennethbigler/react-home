import { atom, selector } from "recoil";
import stockAtom from "./stock-atom";
import dateHelper, { DateObj } from "../apis/DateHelper";

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
 * Stock Tick {string}
 * Price Now {number}
 * Grant Qty {number} - STOCKS
 * Grant Duration {number} - YEARS
 * Grant Then - calculated
 * Grant Now - calculated
 */
export interface CompEntry {
  entryDate: string;
  salary: number;
  bonus: number;
  stockTick: string;
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

export interface PrevStock {
  cs: number;
  csa: number;
  exp: DateObj;
}
export interface PrevStockAcc {
  [key: string]: PrevStock[];
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
    const stockEntries = get(stockAtom);

    const prevStockAcc: PrevStockAcc = {};

    const compCalcEntriesNoNet: Omit<CompCalcEntry, "netDiff">[] =
      compEntries.map(
        ({
          bonus,
          entryDate,
          grantDuration,
          grantQty,
          priceThen,
          salary,
          stockTick,
        }) => {
          const priceNow = stockEntries[stockTick] || 0;
          const cs = (priceThen * grantQty) / grantDuration;
          let stock = 0;
          let stockAdj = 0;

          const csa = (priceNow * grantQty) / grantDuration;
          const exp = dateHelper(entryDate);
          exp.year += grantDuration;

          if (!prevStockAcc[stockTick]) {
            prevStockAcc[stockTick] = [];
          }
          if (cs > 0) {
            prevStockAcc[stockTick].push({ cs, csa, exp });
          }
          prevStockAcc[stockTick].forEach((s) => {
            if (dateHelper(entryDate).diff(s.exp, "days") < 0) {
              stock += s.cs;
              stockAdj += s.csa;
            }
          });

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

        return { totalAdj, netDiff, ...rest };
      },
    );

    return compCalcEntries;
  },
});

const STOCK = 0;
const BONUS = 1;
const SALARY = 2;

export const compChartReadOnlyState = selector({
  key: "compChartReadOnlyState",
  get: ({ get }) => {
    // access state
    const compCalcEntries = get(compCalcReadOnlyState);
    const compEntries = get(compCalcAtom);
    const compChartData: number[][] = [[], [], []];

    compEntries.forEach((cEntry, i) => {
      compChartData[STOCK].push(compCalcEntries[i].stockAdj);
      compChartData[BONUS].push(cEntry.bonus);
      compChartData[SALARY].push(cEntry.salary);
    });

    return compChartData;
  },
});

export default compCalcAtom;
