import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import { type ExpenseEntryColor, expenseEntryColors } from "@/apis/budget";

const categoryColorOptions: ReadonlyArray<{
  value: ExpenseEntryColor | "";
  label: string;
}> = [
  { value: "", label: "Default (None)" },
  ...expenseEntryColors.map((color) => ({
    value: color,
    label: color.charAt(0).toUpperCase() + color.slice(1),
  })),
];

interface CategoryColorSelectProps {
  value?: ExpenseEntryColor;
  onChange: (color?: ExpenseEntryColor) => void;
}

const labelId = "category-color-label";

const CategoryColorSelect = ({ value, onChange }: CategoryColorSelectProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    const nextColor = event.target.value as ExpenseEntryColor | "";
    onChange(nextColor || undefined);
  };

  return (
    <FormControl size="small" fullWidth sx={{ mt: 2, mb: 1 }}>
      <InputLabel id={labelId}>Color (Optional)</InputLabel>
      <Select
        labelId={labelId}
        value={value ?? ""}
        label="Color (Optional)"
        onChange={handleChange}
      >
        {categoryColorOptions.map(({ value: optionValue, label }) => (
          <MenuItem key={label} value={optionValue}>
            <Typography color={optionValue}>{label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryColorSelect;
