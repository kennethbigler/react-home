import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import compCalcState, {
  CompEntry,
  compCalcReadOnlyState,
} from "../../../recoil/comp-calculator-state";
import CompDisplay from "./CompDisplay";
import CompEntryDialog from "./CompEntryDialog";
import StockDialog from "./StockDialog";
import stockAtom from "../../../recoil/stock-atom";
import StockDisplay from "./StockDisplay";
import CompChart from "./CompGraph";
import BreakdownChart from "./BreakdownGraph";

const CompCalculator = () => {
  const [compEntries, setCompEntries] = useRecoilState(compCalcState);
  const compCalcEntries = useRecoilValue(compCalcReadOnlyState);
  const [stockEntries, setStockEntries] = useRecoilState(stockAtom);
  const [openEntry, setOpenEntry] = React.useState(false);
  const [openStock, setOpenStock] = React.useState(false);
  const [editEntryIdx, setEditEntryIdx] = React.useState(-1);
  const [editStockTick, setEditStockTick] = React.useState("");

  // entry open/closers
  const closeEntryModal = () => setOpenEntry(false);
  const openNewEntry = () => {
    setEditEntryIdx(-1);
    setOpenEntry(true);
  };
  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  // stock open/closers
  const closeStockModal = () => setOpenStock(false);
  const openNewStock = () => {
    setEditStockTick("");
    setOpenStock(true);
  };
  const openEditStock = (s: string) => () => {
    setEditStockTick(s);
    setOpenStock(true);
  };

  const addCompEntry = (compEntry: CompEntry) => {
    const newCompEntries = [...compEntries];
    if (editEntryIdx === -1) {
      newCompEntries.push(compEntry);
    } else {
      newCompEntries[editEntryIdx] = compEntry;
    }
    setCompEntries(newCompEntries);
    closeEntryModal();
  };

  const addStockEntry = (stock: string, price: number) => {
    const newStockEntries = { ...stockEntries };
    newStockEntries[stock] = price;
    setStockEntries(newStockEntries);
    closeStockModal();
  };

  const removeStockEntry = (stock: string) => () => {
    const newStockEntries = { ...stockEntries };
    delete newStockEntries[stock];
    setStockEntries(newStockEntries);
    closeStockModal();
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Comp Calculator
      </Typography>
      <div
        className="flex-container"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <StockDisplay
          stockEntries={stockEntries}
          openStockModal={openEditStock}
        />
        <div>
          <Button onClick={openNewStock}>+ Stock</Button>
          <Button onClick={openNewEntry}>+ Entry</Button>
        </div>
      </div>
      {compEntries.length > 0 ? (
        <Grid container>
          <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>
            <CompChart
              compCalcEntries={compCalcEntries}
              compEntries={compEntries}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <BreakdownChart
              salary={compEntries[compEntries.length - 1].salary}
              bonus={compEntries[compEntries.length - 1].bonus}
              stock={compCalcEntries[compCalcEntries.length - 1].stockAdj}
            />
          </Grid>
        </Grid>
      ) : null}
      <CompDisplay
        compEntries={compEntries}
        compCalcEntries={compCalcEntries}
        stockEntries={stockEntries}
        onClick={openEditEntry}
      />
      <StockDialog
        open={openStock}
        price={editStockTick ? stockEntries[editStockTick] : undefined}
        stock={editStockTick}
        onClose={closeStockModal}
        addStockEntry={addStockEntry}
        removeStockEntry={removeStockEntry}
      />
      <CompEntryDialog
        open={openEntry}
        compEntry={editEntryIdx !== -1 ? compEntries[editEntryIdx] : undefined}
        onClose={closeEntryModal}
        addCompEntry={addCompEntry}
      />
    </>
  );
};

export default CompCalculator;