import { MouseEventHandler } from "react";
import Button from "@mui/material/Button";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../jotai/deal-or-no-deal-state";

interface CaseProps {
  briefcase: Briefcase;
  isOver: boolean;
  onClick: MouseEventHandler;
  secondary?: boolean;
}

const Case = ({ briefcase: bc, isOver, onClick, secondary }: CaseProps) => {
  const color = secondary ? "secondary" : "primary";
  const label = bc.on && !isOver ? bc.loc : getMoneyText(bc.val);

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
