import persistentAtom from "./storage";

export interface StockState {
  [key: string]: number;
}

const stockAtom = persistentAtom<StockState>("stockAtom", {});

export default stockAtom;
