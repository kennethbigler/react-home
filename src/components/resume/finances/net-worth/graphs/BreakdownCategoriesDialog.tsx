import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
} from "@mui/material";

interface BreakdownCategoriesDialogProps {
  open: boolean;
  categories: string[];
  amounts: Record<string, number>;
  hiddenCategories: ReadonlySet<string>;
  onClose: () => void;
  onToggle: (category: string, visible: boolean) => void;
}

export const BreakdownCategoriesDialog = ({
  open,
  categories,
  amounts,
  hiddenCategories,
  onClose,
  onToggle,
}: BreakdownCategoriesDialogProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>Show Categories</DialogTitle>
    <DialogContent dividers>
      {categories.map((category) => {
        const hasValue = (amounts[category] ?? 0) > 0;

        return (
          <FormControlLabel
            key={category}
            control={
              <Switch
                checked={hasValue && !hiddenCategories.has(category)}
                disabled={!hasValue}
                onChange={(_, checked) => onToggle(category, checked)}
                slotProps={{ input: { "aria-label": `Show ${category}` } }}
              />
            }
            label={category}
          />
        );
      })}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);
