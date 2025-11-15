import ArrowDown from "@mui/icons-material/ArrowDropDown";
import ArrowUp from "@mui/icons-material/ArrowDropUp";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { usePlayerAdjControls } from "../useBotC";
import { Button, ButtonGroup } from "@mui/material";

interface PlayerAdjControlsProps {
  i: number;
  count: number;
}

const PlayerAdjControls = ({ i, count }: PlayerAdjControlsProps) => {
  const updateOrder = usePlayerAdjControls();

  const isFull = count % 2 === 0;
  const last = count - 1;
  const hasMid = isFull && i === last - 1;

  return (
    <ButtonGroup aria-label="move player" orientation="vertical" variant="text">
      <Button aria-label="up" size="small" onClick={updateOrder(i, true)}>
        {i >= 3 && !hasMid && <ArrowUp />}
        {(i === 1 || i === 2 || hasMid) && <ArrowLeft />}
        {i === 0 && <ArrowRight />}
      </Button>
      <Button aria-label="down" size="small" onClick={updateOrder(i, false)}>
        {(i === 0 || (i >= 2 && i < last - (isFull ? 2 : 1))) && <ArrowDown />}
        {i === last && <ArrowLeft />}
        {(i === 1 || i === last - 1 || (isFull && i === last - 2)) && (
          <ArrowRight />
        )}
      </Button>
    </ButtonGroup>
  );
};

export default PlayerAdjControls;
