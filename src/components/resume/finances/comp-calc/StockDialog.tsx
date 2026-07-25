import { memo, useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  type TextFieldProps,
} from "@mui/material";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

interface StockDialogProps {
  open: boolean;
  price?: number;
  stock?: string;
  onClose: () => void;
  addStockEntry: (s: string, n: number) => void;
  removeStockEntry: (s: string) => () => void;
}

const StockDialog = memo(
  ({
    open,
    price: exPrice,
    stock: exStock,
    onClose,
    addStockEntry,
    removeStockEntry,
  }: StockDialogProps) => {
    const [price, setPrice] = useState(exPrice || 0);
    const [stock, setStock] = useState(exStock || "");
    const [error, setError] = useState("");

    const resetState = () => {
      setPrice(0);
      setStock("");
      setError("");
    };

    const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
      setStock(e.target.value);
      setError("");
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
      setPrice(parseFloat(e.target.value) || 0);
      setError("");
    };

    const handleSubmit = () => {
      const normalizedStock = stock.trim().toUpperCase();
      if (!normalizedStock) {
        setError("Enter a stock ticker.");
        return;
      }
      if (price < 0) {
        setError("Stock price must be zero or greater.");
        return;
      }

      addStockEntry(normalizedStock, price);
      resetState();
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{exStock ? "Edit" : "New"} Stock Entry</DialogTitle>
        <DialogContent>
          <div style={{ marginTop: 5 }}>
            <TextField
              label="Stock"
              value={stock}
              onChange={handleStockChange}
              {...tfProps}
            />
            <TextField
              label="Price Now"
              value={price}
              type="number"
              onChange={handlePriceChange}
              slotProps={{ input: { startAdornment: "$" } }}
              {...tfProps}
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
          </div>
        </DialogContent>
        <DialogActions>
          {exStock ? (
            <Button onClick={removeStockEntry(exStock)} color="error">
              Delete
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>
            {exStock ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

StockDialog.displayName = "StockDialog";

export default StockDialog;
