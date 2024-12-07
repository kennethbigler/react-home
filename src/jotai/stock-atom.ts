import { atomWithStorage } from "jotai/utils";

export interface StockState {
  [key: string]: number;
}

const stockAtom = atomWithStorage<StockState>("stockAtom", {});

export default stockAtom;
