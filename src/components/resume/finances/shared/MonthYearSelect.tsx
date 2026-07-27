import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";
import { months } from "../../../../apis/DateHelper";
import { entryYears } from "./useMonthYear";

interface MonthYearSelectProps {
  /** Unique prefix for the select label ids, e.g. "comp-entry". */
  idPrefix: string;
  month: string;
  year: string;
  onMonthChange: (event: SelectChangeEvent<string>) => void;
  onYearChange: (event: SelectChangeEvent<string>) => void;
}

/** Paired month/year dropdowns used by the finances entry dialogs. */
const MonthYearSelect = ({
  idPrefix,
  month,
  year,
  onMonthChange,
  onYearChange,
}: MonthYearSelectProps) => (
  <Stack direction="row" sx={{ marginTop: 0.625 }}>
    <FormControl fullWidth>
      <InputLabel id={`${idPrefix}-month-select`}>Month</InputLabel>
      <Select
        labelId={`${idPrefix}-month-select`}
        label="Month"
        value={month}
        onChange={onMonthChange}
      >
        {months.map((monthName, i) => (
          <MenuItem value={String(i + 1)} key={monthName}>
            {monthName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel id={`${idPrefix}-year-select`}>Year</InputLabel>
      <Select
        labelId={`${idPrefix}-year-select`}
        label="Year"
        value={year}
        onChange={onYearChange}
      >
        {entryYears.map((entryYear) => (
          <MenuItem value={String(entryYear)} key={entryYear}>
            {entryYear}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Stack>
);

export default MonthYearSelect;
