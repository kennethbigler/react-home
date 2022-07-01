import React from "react";
import Paper from "@mui/material/Paper";
import { amber, grey } from "@mui/material/colors";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../recoil/deal-or-no-deal-atom";

interface MoneyProps {
  briefcase: Briefcase;
}

const paperStyles: React.CSSProperties = {
  width: "90%",
  marginLeft: "5%",
  marginRight: "5%",
  marginBottom: 5,
  padding: 5,
  textAlign: "center",
  color: "white",
};

const Money: React.FC<MoneyProps> = (props: MoneyProps) => {
  const { briefcase: bc } = props;

  const color: React.CSSProperties = {
    backgroundColor: bc.on ? amber[500] : grey[700],
  };

  const style: React.CSSProperties = {
    ...paperStyles,
    ...color,
  };

  return (
    <Paper style={style}>
      {bc.on ? getMoneyText(bc.val) : <del>{getMoneyText(bc.val)}</del>}
    </Paper>
  );
};

export default Money;
