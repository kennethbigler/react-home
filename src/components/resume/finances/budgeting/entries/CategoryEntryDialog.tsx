import { useState, type ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  formatCategoryName,
  normalizeCategoryKey,
  type BudgetCategory,
  type ExpenseEntryColor,
} from "@/apis/budget";
import {
  DEFAULT_RECOMMENDED_CATEGORY,
  RECOMMENDED_BUDGET_CATEGORIES,
  type RecommendedCategoryKey,
} from "@/constants/recommended-budget";
import ConfirmDeleteDialog from "@/components/resume/finances/shared/ConfirmDeleteDialog";
import dialogFormControlProps from "@/components/resume/finances/shared/dialogFormControlProps";
import dialogTextFieldProps from "@/components/resume/finances/shared/dialogTextFieldProps";
import useConfirmDelete from "@/components/resume/finances/shared/useConfirmDelete";
import CategoryColorSelect from "./CategoryColorSelect";

interface CategoryEntryDialogProps {
  open: boolean;
  category?: BudgetCategory;
  color?: ExpenseEntryColor;
  /** Normalized keys of the other categories, for duplicate checks. */
  otherCategoryKeys: string[];
  inUse: boolean;
  onClose: () => void;
  onSave: (category: BudgetCategory, color?: ExpenseEntryColor) => void;
  onDelete?: () => void;
}

const CategoryEntryDialog = ({
  open,
  category,
  color: initialColor,
  otherCategoryKeys,
  inUse,
  onClose,
  onSave,
  onDelete,
}: CategoryEntryDialogProps) => {
  const [name, setName] = useState(category?.name ?? "");
  const [recommended, setRecommended] = useState<RecommendedCategoryKey>(
    category?.recommended ?? DEFAULT_RECOMMENDED_CATEGORY,
  );
  const [color, setColor] = useState<ExpenseEntryColor | undefined>(
    initialColor,
  );
  const confirmDelete = useConfirmDelete(() => onDelete?.());

  const isDuplicate = otherCategoryKeys.includes(normalizeCategoryKey(name));
  const canSubmit = name.trim().length > 0 && !isDuplicate;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleRecommendedChange = (
    e: SelectChangeEvent<RecommendedCategoryKey>,
  ) => setRecommended(e.target.value as RecommendedCategoryKey);
  const handleSubmit = () =>
    onSave({ name: formatCategoryName(name), recommended }, color);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{category ? "Edit" : "New"} Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            error={isDuplicate}
            helperText={isDuplicate ? "Category already exists." : undefined}
            {...dialogTextFieldProps}
          />
          <FormControl {...dialogFormControlProps}>
            <InputLabel id="recommended-category-label">
              Recommended Category
            </InputLabel>
            <Select
              labelId="recommended-category-label"
              value={recommended}
              label="Recommended Category"
              onChange={handleRecommendedChange}
            >
              {RECOMMENDED_BUDGET_CATEGORIES.map(({ key, label, percent }) => (
                <MenuItem key={key} value={key}>
                  {`${label} (${percent}%)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CategoryColorSelect value={color} onChange={setColor} />
        </DialogContent>
        <DialogActions>
          {category && onDelete ? (
            <Button
              onClick={confirmDelete.request}
              color="error"
              disabled={inUse}
              aria-describedby={inUse ? "category-in-use" : undefined}
            >
              Delete
            </Button>
          ) : null}
          {category && onDelete && inUse ? (
            <FormHelperText id="category-in-use" sx={{ mr: "auto" }}>
              Move its expenses first.
            </FormHelperText>
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
            {category ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDelete.open}
        title="Delete category?"
        description="This category will be permanently deleted."
        confirmLabel="Delete category"
        onCancel={confirmDelete.cancel}
        onConfirm={confirmDelete.confirm}
      />
    </>
  );
};

export default CategoryEntryDialog;
