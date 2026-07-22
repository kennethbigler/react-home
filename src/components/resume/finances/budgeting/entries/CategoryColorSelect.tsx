import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  ExpenseEntryColor,
  expenseEntryColors,
} from "../../../../../jotai/finances-atom";

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
  categoryKey: string;
  value?: ExpenseEntryColor;
  onChange: (categoryKey: string, color?: ExpenseEntryColor) => void;
}

const CategoryColorSelect = ({
  categoryKey,
  value,
  onChange,
}: CategoryColorSelectProps) => {
  const labelId = `${categoryKey}-color-label`;

  const handleChange = (event: SelectChangeEvent) => {
    const nextColor = event.target.value as ExpenseEntryColor | "";
    onChange(categoryKey, nextColor || undefined);
  };

  return (
    <FormControl size="small" fullWidth sx={{ mb: 1 }}>
      <InputLabel id={labelId}>Color (Optional)</InputLabel>
      <Select
        labelId={labelId}
        value={value ?? ""}
        label="Color (Optional)"
        onChange={handleChange}
        onClick={(event) => event.stopPropagation()}
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
