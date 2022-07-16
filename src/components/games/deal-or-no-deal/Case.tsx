import React from "react";
import Button from "@mui/material/Button";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../recoil/deal-or-no-deal-state";

interface CaseProps {
  briefcase: Briefcase;
  onClick: React.MouseEventHandler;
  secondary?: boolean;
}

const style = { margin: 10, color: "black" };

const Case: React.FC<CaseProps> = (props: CaseProps) => {
  const { onClick, briefcase: bc, secondary } = props;
  const color = secondary ? "secondary" : "primary";
  const label = bc.on ? bc.loc : getMoneyText(bc.val);

  return (
    <Button
      color={color}
      disabled={!bc.on}
      onClick={onClick}
      style={style}
      variant="contained"
    >
      {label}
    </Button>
  );
};

export default Case;
