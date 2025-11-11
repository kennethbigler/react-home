import { ReactElement } from "react";
import { Chip } from "@mui/material";

export const getCSV = (arr: string[] = []): ReactElement[] => {
  const style = { marginRight: 5, marginBottom: 5 };
  return arr.map((item) => <Chip key={item} label={item} style={style} />);
};
