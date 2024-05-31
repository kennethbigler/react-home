import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { months } from "../../../apis/DateHelper";

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
  handleClose: () => void;
}

const CompEntryDialog: React.FC<CompEntryDialogProps> = ({
  open,
  handleClose,
}) => {
  const [entryDateMonth, setEntryDateMonth] = React.useState(months[0]);
  const [entryDateYear, setEntryDateYear] = React.useState(years[0].toString());
  const [salary, setSalary] = React.useState(0);
  const [bonus, setBonus] = React.useState(0);
  const [priceNow, setPriceNow] = React.useState(0);
  const [priceThen, setPriceThen] = React.useState(0);
  const [grantDuration, setGrantDuration] = React.useState(4);
  const [grantQty, setGrantQty] = React.useState(0);

  const handleChange =
    (func: (n: number) => void) => (e: React.ChangeEvent) => {
      // @ts-expect-error: value will exist
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      func(e.target.value);
    };

  const handleSelectMonth = (e: SelectChangeEvent<string>) =>
    setEntryDateMonth(e.target.value);
  const handleSelectYear = (e: SelectChangeEvent<string>) =>
    setEntryDateYear(e.target.value);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Comp Entry</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex" }}>
          <FormControl fullWidth>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
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
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
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
          onChange={handleChange(setSalary)}
          {...tfProps}
        />
        <TextField
          label="Bonus"
          value={bonus}
          onChange={handleChange(setBonus)}
          {...tfProps}
        />
        <DialogContentText variant="h6" component="h4" sx={{ marginTop: 7 }}>
          Stock
        </DialogContentText>
        <TextField
          label="Grant Quantity"
          value={grantQty}
          onChange={handleChange(setGrantQty)}
          {...tfProps}
        />
        <TextField
          label="Grant Duration"
          value={grantDuration}
          onChange={handleChange(setGrantDuration)}
          {...tfProps}
        />
        <TextField
          label="Grant Value Then"
          value={priceThen}
          onChange={handleChange(setPriceThen)}
          {...tfProps}
        />
        <TextField
          label="Grant Value Now"
          value={priceNow}
          onChange={handleChange(setPriceNow)}
          {...tfProps}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompEntryDialog;
