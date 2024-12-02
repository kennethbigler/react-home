import { atom, selector } from "recoil";
import stockAtom from "./stock-atom";
import dateHelper, { DateObj } from "../apis/DateHelper";

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

interface PrevStock {
  grantQty: number;
  grantDuration: number;
  exp: DateObj;
}
interface PrevStockAcc {
  [key: string]: PrevStock[];
}

type CompCalcState = CompEntry[];

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
          let stock = 0;
          let stockAdj = 0;

          const exp = dateHelper(entryDate);
          exp.year += grantDuration;

          if (!prevStockAcc[stockTick]) {
            prevStockAcc[stockTick] = [];
          }
          if (grantQty > 0) {
            prevStockAcc[stockTick].push({ grantQty, grantDuration, exp });
          }
          prevStockAcc[stockTick].forEach((s) => {
            if (dateHelper(entryDate).diff(s.exp, "days") < 0) {
              stock += (priceThen * s.grantQty) / s.grantDuration;
              stockAdj += (priceNow * s.grantQty) / s.grantDuration;
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

export default compCalcAtom;
