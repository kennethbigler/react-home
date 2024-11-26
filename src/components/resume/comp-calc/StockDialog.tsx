import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { TextFieldProps } from "@mui/material";

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

const StockDialog = React.memo(
  ({
    open,
    price: exPrice,
    stock: exStock,
    onClose,
    addStockEntry,
    removeStockEntry,
  }: StockDialogProps) => {
    const [price, setPrice] = React.useState(0);
    const [stock, setStock] = React.useState("");

    const resetState = () => {
      setPrice(0);
      setStock("");
    };

    React.useEffect(() => {
      if (exStock && exPrice !== undefined) {
        setPrice(exPrice);
        setStock(exStock);
      } else {
        resetState();
      }
    }, [exPrice, exStock]);

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setStock(e.target.value);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
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
