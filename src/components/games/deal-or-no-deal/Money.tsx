import { CSSProperties, memo } from "react";
import Paper from "@mui/material/Paper";
import { amber, grey } from "@mui/material/colors";
import { getMoneyText } from "./helpers";

interface MoneyProps {
  on: boolean;
  val: number;
}

const paperStyles: CSSProperties = {
  width: "90%",
  marginLeft: "5%",
  marginRight: "5%",
  marginBottom: 5,
  padding: 5,
  textAlign: "center",
  color: "white",
};

const Money = memo(({ on, val }: MoneyProps) => {
  const color: CSSProperties = {
    backgroundColor: on ? amber[500] : grey[700],
  };

  const style: CSSProperties = {
    ...paperStyles,
    ...color,
  };

  return (
    <Paper style={style}>
      {on ? getMoneyText(val) : <del>{getMoneyText(val)}</del>}
    </Paper>
  );
});

Money.displayName = "Money";

export default Money;
