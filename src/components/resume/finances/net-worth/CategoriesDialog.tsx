import { ChangeEvent, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
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
  SelectChangeEvent,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

interface CategoryRow {
  id: string;
  name: string;
  previousName?: string;
}

interface PendingMerge {
  from: string;
  intoRowId: string;
}

interface PendingRemoval {
  rowId: string;
  sourceKey: string;
  label: string;
  targetId: string;
}

export interface CategoryMerge {
  from: string;
  into: string;
}

interface CategoriesDialogProps {
  open: boolean;
  categories: string[];
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

  const handleNameChange =
    (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, name: value } : row)),
      );
      setError("");
    };

  const addRow = () => {
    setRows((prev) => [...prev, { id: nextId(), name: "" }]);
    setError("");
  };

  const dropRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setMerges((prev) => prev.filter((merge) => merge.intoRowId !== id));
    setError("");
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
    if (!pendingRemoval?.targetId) {
      return;
    }
    setMerges((prev) => [
      ...prev,
      { from: pendingRemoval.sourceKey, intoRowId: pendingRemoval.targetId },
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
      onSave([], [], []);
      return;
    }

    const trimmed = rows.map((row) => ({
      ...row,
      name: row.name.trim(),
    }));

    if (trimmed.some((row) => !row.name)) {
      setError("Category names cannot be empty.");
      return;
    }

    const names = trimmed.map((row) => row.name);
    if (new Set(names).size !== names.length) {
      setError("Category names must be unique.");
      return;
    }

    const resolvedMerges: CategoryMerge[] = [];
    merges.forEach(({ from, intoRowId }) => {
      const target = trimmed.find((row) => row.id === intoRowId);
      if (!target) {
        return;
      }
      const into = target.previousName ?? target.name;
      resolvedMerges.push({ from, into });
    });

    onSave(
      names,
      trimmed.map(({ name, previousName }) => ({ name, previousName })),
      resolvedMerges,
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
          {rows.map((row, index) => (
            <div
              key={row.id}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <TextField
                label={`Category ${index + 1}`}
                value={row.name}
                onChange={handleNameChange(row.id)}
                {...tfProps}
              />
              <IconButton
                aria-label="remove category"
                onClick={removeRow(row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button onClick={addRow} sx={{ marginTop: 1 }}>
            Add Category
          </Button>
          {error ? (
            <Typography color="error" sx={{ marginTop: 1 }}>
              {error}
            </Typography>
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
