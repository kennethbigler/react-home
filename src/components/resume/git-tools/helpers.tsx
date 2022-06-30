import React from "react";
import MenuItem from "@mui/material/MenuItem";

export const validTypingId = /[A-Z]{1,4}-?[a-zA-Z0-9]*/;

/** function to generate select items based of input */
export const getSelectOptions = (arr: string[]): React.ReactNode =>
  arr.map((t, i) => (
    <MenuItem key={i} value={t}>
      {t}
    </MenuItem>
  ));
