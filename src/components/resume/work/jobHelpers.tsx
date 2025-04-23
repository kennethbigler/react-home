import * as React from "react";
import Chip from "@mui/material/Chip";

export const getCSV = (arr: string[] = []): React.ReactElement[] => {
  const style = { marginRight: 5, marginBottom: 5 };
  return arr.map((item) => <Chip key={item} label={item} style={style} />);
};
