import type { FormControlProps } from "@mui/material";

/** Standard-variant select FormControl props shared by the finances entry dialogs. */
const dialogFormControlProps: FormControlProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
  // Extra room so the select label clears the field above it.
  sx: { mt: 2 },
};

export default dialogFormControlProps;
