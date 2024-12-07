import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { TextFieldProps, SelectChangeEvent } from "@mui/material";
import dateHelper, { months } from "../../../apis/DateHelper";
import { CompEntry } from "../../../jotai/comp-calculator-state";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

const currentYear = new Date().getFullYear() - 2000;
const years: number[] = [];
for (let i = 0; i <= currentYear; i += 1) {
  years.push(2000 + i);
}
years.reverse();

interface CompEntryDialogProps {
  open: boolean;
  compEntry?: CompEntry;
  onClose: () => void;
  addCompEntry: (n: CompEntry) => void;
}

const CompEntryDialog = ({
  open,
  compEntry,
  onClose,
  addCompEntry,
}: CompEntryDialogProps) => {
  const [entryDateMonth, setEntryDateMonth] = React.useState("1");
  const [entryDateYear, setEntryDateYear] = React.useState(years[0].toString());
  const [salary, setSalary] = React.useState(0);
  const [bonus, setBonus] = React.useState(0);
  const [stockTick, setStockTick] = React.useState("");
  const [priceThen, setPriceThen] = React.useState(0);
  const [grantDuration, setGrantDuration] = React.useState(4);
  const [grantQty, setGrantQty] = React.useState(0);

  const resetState = () => {
    setEntryDateMonth("1");
    setEntryDateYear(years[0].toString());
    setSalary(0);
    setBonus(0);
    setStockTick("");
    setPriceThen(0);
    setGrantDuration(4);
    setGrantQty(0);
  };

  React.useEffect(() => {
    if (compEntry) {
      const { month, year } = dateHelper(compEntry.entryDate);
      setEntryDateMonth((month + 1).toString());
      setEntryDateYear(year.toString());
      setSalary(compEntry.salary);
      setBonus(compEntry.bonus);
      setStockTick(compEntry.stockTick);
      setPriceThen(compEntry.priceThen);
      setGrantDuration(compEntry.grantDuration);
      setGrantQty(compEntry.grantQty);
    } else {
      resetState();
    }
  }, [compEntry, compEntry?.salary]);

  const handleChange =
    (func: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      func(parseFloat(e.target.value));
  const handleStockTick = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStockTick(e.target.value);
  const handleSelectMonth = (e: SelectChangeEvent<string>) =>
    setEntryDateMonth(e.target.value);
  const handleSelectYear = (e: SelectChangeEvent<string>) =>
    setEntryDateYear(e.target.value);

  const handleSubmit = () => {
    addCompEntry({
      entryDate: `${entryDateYear}-${entryDateMonth.length < 2 ? "0" : ""}${entryDateMonth}`,
      salary,
      bonus,
      stockTick,
      priceThen,
      grantDuration,
      grantQty,
    });
    resetState();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{compEntry ? "Edit" : "New"} Comp Entry</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", marginTop: 5 }}>
          <FormControl fullWidth>
            <InputLabel id="month-select">Month</InputLabel>
            <Select
              labelId="month-select"
              label="Month"
              value={entryDateMonth}
              onChange={handleSelectMonth}
            >
              {months.map((month, i) => (
                <MenuItem value={i + 1} key={i}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="year-select">Year</InputLabel>
            <Select
              labelId="year-select"
              label="Year"
              value={entryDateYear}
              onChange={handleSelectYear}
            >
              {years.map((year) => (
                <MenuItem value={year} key={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <TextField
          label="Salary"
          value={salary}
          type="number"
          onChange={handleChange(setSalary)}
          slotProps={{ input: { startAdornment: "$" } }}
          {...tfProps}
        />
        <TextField
          label="Bonus"
          value={bonus}
          type="number"
          onChange={handleChange(setBonus)}
          slotProps={{ input: { startAdornment: "$" } }}
          {...tfProps}
        />
        <DialogContentText variant="h6" component="h4" sx={{ marginTop: 7 }}>
          Stock
        </DialogContentText>
        <TextField
          label="Stock Ticker"
          value={stockTick}
          onChange={handleStockTick}
          {...tfProps}
        />
        <TextField
          label="Grant Quantity"
          value={grantQty}
          type="number"
          onChange={handleChange(setGrantQty)}
          {...tfProps}
        />
        <TextField
          label="Grant Duration"
          value={grantDuration}
          type="number"
          onChange={handleChange(setGrantDuration)}
          {...tfProps}
        />
        <TextField
          label="Stock Price Then"
          value={priceThen}
          type="number"
          onChange={handleChange(setPriceThen)}
          slotProps={{ input: { startAdornment: "$" } }}
          {...tfProps}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>
          {compEntry ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompEntryDialog;
