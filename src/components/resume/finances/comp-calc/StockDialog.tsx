import { useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";
import dialogTextFieldProps from "../shared/dialogTextFieldProps";
import useConfirmDelete from "../shared/useConfirmDelete";

const VALIDATION_ERROR_ID = "stock-dialog-validation-error";
const STOCK_ERROR = "Enter a stock ticker.";
const PRICE_ERROR = "Stock price must be zero or greater.";

type FieldError = "stock" | "price";

interface StockDialogProps {
  open: boolean;
  price?: number;
  stock?: string;
  onClose: () => void;
  addStockEntry: (s: string, n: number) => void;
  removeStockEntry: (s: string) => () => void;
}

const fieldA11y = (invalid: boolean) =>
  invalid
    ? {
        error: true as const,
        slotProps: {
          htmlInput: {
            "aria-invalid": true as const,
            "aria-describedby": VALIDATION_ERROR_ID,
          },
        },
      }
    : {};

const StockDialog = ({
  open,
  price: exPrice,
  stock: exStock,
  onClose,
  addStockEntry,
  removeStockEntry,
}: StockDialogProps) => {
  const [price, setPrice] = useState(exPrice || 0);
  const [stock, setStock] = useState(exStock || "");
  const [fieldError, setFieldError] = useState<FieldError | null>(null);
  const confirmDelete = useConfirmDelete(() => {
    if (exStock) {
      removeStockEntry(exStock)();
    }
  });

  const errorMessage =
    fieldError === "stock"
      ? STOCK_ERROR
      : fieldError === "price"
        ? PRICE_ERROR
        : "";

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value);
    if (fieldError === "stock") setFieldError(null);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value) || 0);
    if (fieldError === "price") setFieldError(null);
  };

  const handleSubmit = () => {
    const normalizedStock = stock.trim().toUpperCase();
    if (!normalizedStock) {
      setFieldError("stock");
      return;
    }
    if (price < 0) {
      setFieldError("price");
      return;
    }

    addStockEntry(normalizedStock, price);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{exStock ? "Edit" : "New"} Stock Entry</DialogTitle>
        <DialogContent>
          <div style={{ marginTop: 5 }}>
            <TextField
              label="Stock"
              value={stock}
              onChange={handleStockChange}
              {...dialogTextFieldProps}
              {...fieldA11y(fieldError === "stock")}
            />
            <TextField
              label="Price Now"
              value={price}
              type="number"
              onChange={handlePriceChange}
              slotProps={{
                input: { startAdornment: "$" },
                ...(fieldA11y(fieldError === "price").slotProps ?? {}),
              }}
              {...dialogTextFieldProps}
              {...(fieldError === "price" ? { error: true } : {})}
            />
            {errorMessage ? (
              <Alert id={VALIDATION_ERROR_ID} severity="error">
                {errorMessage}
              </Alert>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          {exStock ? (
            <Button onClick={confirmDelete.request} color="error">
              Delete stock entry
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>
            {exStock ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDelete.open}
        title="Delete stock entry?"
        description="This stock entry will be permanently deleted."
        confirmLabel="Delete entry"
        onCancel={confirmDelete.cancel}
        onConfirm={confirmDelete.confirm}
      />
    </>
  );
};

export default StockDialog;
