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
import dialogTextFieldProps from "../shared/dialogTextFieldProps";

interface StockDialogProps {
  open: boolean;
  price?: number;
  stock?: string;
  onClose: () => void;
  addStockEntry: (s: string, n: number) => void;
  removeStockEntry: (s: string) => () => void;
}

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
  const [error, setError] = useState("");

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
            {...dialogTextFieldProps}
          />
          <TextField
            label="Price Now"
            value={price}
            type="number"
            onChange={handlePriceChange}
            slotProps={{ input: { startAdornment: "$" } }}
            {...dialogTextFieldProps}
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
};

export default StockDialog;
