import * as React from "react";
import Button from "@mui/material/Button";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../recoil/deal-or-no-deal-state";

interface CaseProps {
  briefcase: Briefcase;
  onClick: React.MouseEventHandler;
  secondary?: boolean;
}

const Case: React.FC<CaseProps> = (props: CaseProps) => {
  const { onClick, briefcase: bc, secondary } = props;
  const color = secondary ? "secondary" : "primary";
  const label = bc.on ? bc.loc : getMoneyText(bc.val);

  return (
    <Button
      color={color}
      disabled={!bc.on}
      onClick={onClick}
      style={{ margin: 10 }}
      variant="contained"
    >
      {label}
    </Button>
  );
};

export default Case;
