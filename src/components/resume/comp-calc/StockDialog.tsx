import { memo, useState, ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TextFieldProps,
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

    const resetState = () => {
      setPrice(0);
      setStock("");
    };

    const handleStockChange = (e: ChangeEvent<HTMLInputElement>) =>
      setStock(e.target.value);

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) =>
      setPrice(parseFloat(e.target.value));

    const handleSubmit = () => {
      addStockEntry(stock, price);
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={removeStockEntry(stock)} color="error">
            Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>
            {exStock ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

StockDialog.displayName = "StockDialog";

export default StockDialog;
