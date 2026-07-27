import { type ChangeEvent, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  resolveCategoryMerges,
  type CategoryMerge,
  type CategoryRow,
  type PendingMerge,
} from "./resolveCategoryMerges";
import dialogTextFieldProps from "../shared/dialogTextFieldProps";

export type { CategoryMerge } from "./resolveCategoryMerges";

const VALIDATION_ERROR_ID = "categories-dialog-validation-error";

interface PendingRemoval {
  rowId: string;
  sourceKey: string;
  label: string;
  targetId: string;
}

interface CategoriesDialogProps {
  open: boolean;
  categories: string[];
  hasEntries?: boolean;
  onClose: () => void;
  onSave: (
    categories: string[],
    mappings: { name: string; previousName?: string }[],
    merges: CategoryMerge[],
  ) => void;
}

let rowId = 0;
const nextId = () => {
  rowId += 1;
  return `category-row-${rowId}`;
};

const CategoriesDialog = ({
  open,
  categories,
  hasEntries = false,
  onClose,
  onSave,
}: CategoriesDialogProps) => {
  const [rows, setRows] = useState<CategoryRow[]>(() =>
    categories.length > 0
      ? categories.map((name) => ({
          id: nextId(),
          name,
          previousName: name,
        }))
      : [{ id: nextId(), name: "" }],
  );
  const [merges, setMerges] = useState<PendingMerge[]>([]);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(
    null,
  );
  const [error, setError] = useState("");
  const [invalidIds, setInvalidIds] = useState<string[]>([]);

  const clearValidation = () => {
    setError("");
    setInvalidIds([]);
  };

  const handleNameChange =
    (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, name: value } : row)),
      );
      clearValidation();
    };

  const addRow = () => {
    setRows((prev) => [...prev, { id: nextId(), name: "" }]);
    clearValidation();
  };

  const dropRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setMerges((prev) => prev.filter((merge) => merge.intoRowId !== id));
    clearValidation();
  };

  const removeRow = (id: string) => () => {
    const row = rows.find((r) => r.id === id);
    if (!row) {
      return;
    }
    const remaining = rows.filter((r) => r.id !== id);
    const sourceKey = row.previousName;

    if (sourceKey && remaining.length > 0) {
      setPendingRemoval({
        rowId: id,
        sourceKey,
        label: row.name.trim() || sourceKey,
        targetId: remaining[0].id,
      });
      return;
    }

    dropRow(id);
  };

  const closeMergePrompt = () => {
    setPendingRemoval(null);
  };

  const confirmMergeNo = () => {
    if (!pendingRemoval) {
      return;
    }
    dropRow(pendingRemoval.rowId);
    closeMergePrompt();
  };

  const confirmMergeYes = () => {
    if (!pendingRemoval) {
      return;
    }
    setMerges((prev) => [
      ...prev,
      {
        from: pendingRemoval.sourceKey,
        intoRowId: pendingRemoval.targetId,
      },
    ]);
    dropRow(pendingRemoval.rowId);
    closeMergePrompt();
  };

  const handleMergeTargetChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setPendingRemoval((prev) => (prev ? { ...prev, targetId: value } : prev));
  };

  const handleSave = () => {
    if (rows.length === 0) {
      if (hasEntries) {
        setError(
          "Keep at least one category while net worth entries contain data.",
        );
        return;
      }
      onSave([], [], []);
      return;
    }

    const trimmed = rows.map((row) => ({
      ...row,
      name: row.name.trim(),
    }));

    const emptyIds = trimmed.filter((row) => !row.name).map((row) => row.id);
    if (emptyIds.length > 0) {
      setInvalidIds(emptyIds);
      setError("Category names cannot be empty.");
      return;
    }

    const names = trimmed.map((row) => row.name);
    if (new Set(names).size !== names.length) {
      const seen = new Map<string, string>();
      const duplicateIds: string[] = [];
      trimmed.forEach((row) => {
        const firstId = seen.get(row.name);
        if (firstId) {
          duplicateIds.push(row.id);
          if (!duplicateIds.includes(firstId)) {
            duplicateIds.push(firstId);
          }
        } else {
          seen.set(row.name, row.id);
        }
      });
      setInvalidIds(duplicateIds);
      setError("Category names must be unique.");
      return;
    }

    onSave(
      names,
      trimmed.map(({ name, previousName }) => ({ name, previousName })),
      resolveCategoryMerges(merges, trimmed),
    );
  };

  const mergeTargetOptions = pendingRemoval
    ? rows.filter((row) => row.id !== pendingRemoval.rowId)
    : [];

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Set Categories</DialogTitle>
        <DialogContent>
          {rows.map((row, index) => {
            const isInvalid = invalidIds.includes(row.id);

            return (
              <Box
                key={row.id}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TextField
                  label={`Category ${index + 1}`}
                  value={row.name}
                  onChange={handleNameChange(row.id)}
                  error={isInvalid}
                  slotProps={{
                    htmlInput: {
                      "aria-invalid": isInvalid || undefined,
                      "aria-describedby": isInvalid
                        ? VALIDATION_ERROR_ID
                        : undefined,
                    },
                  }}
                  {...dialogTextFieldProps}
                />
                <IconButton
                  aria-label="remove category"
                  onClick={removeRow(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button onClick={addRow} sx={{ marginTop: 1 }}>
            Add Category
          </Button>
          {error ? (
            <Alert
              id={VALIDATION_ERROR_ID}
              severity="error"
              sx={{ marginTop: 1 }}
            >
              {error}
            </Alert>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(pendingRemoval)}
        onClose={closeMergePrompt}
        // Avoid leaving the parent dialog aria-hidden during exit animation in tests/UI.
        disableRestoreFocus
        slotProps={{
          transition: { timeout: 0 },
        }}
      >
        <DialogTitle>Apply removed category values?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to apply {pendingRemoval?.label}&apos;s values to
            another category?
          </DialogContentText>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="merge-category-select">Category</InputLabel>
            <Select
              labelId="merge-category-select"
              label="Category"
              value={pendingRemoval?.targetId ?? ""}
              onChange={handleMergeTargetChange}
            >
              {mergeTargetOptions.map((row, index) => (
                <MenuItem value={row.id} key={row.id}>
                  {row.name.trim() || `Category ${index + 1}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmMergeNo}>No</Button>
          <Button
            onClick={confirmMergeYes}
            disabled={!pendingRemoval?.targetId}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoriesDialog;
