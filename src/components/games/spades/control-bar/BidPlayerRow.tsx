import * as React from "react";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { MAX_BID, MIN_BID } from "../../../../jotai/spades-atom";

interface BidPlayerRowProps {
  id: string;
  canTrain?: boolean;
  bid: number;
  blind: boolean;
  train: boolean;
  onBid: (bid: number, blind: boolean, train: boolean) => void;
}

const BidPlayerRow = ({
  id,
  canTrain,
  bid,
  blind,
  train,
  onBid,
}: BidPlayerRowProps) => {
  const handleBid = (_e: Event, value: number | number[]) => {
    const newNum = Array.isArray(value) ? value[0] : value;
    onBid(newNum, false, false);
  };
  const handleBlind = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    onBid(bid, checked, false);
  };
  const handleTrain = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    onBid(bid, false, checked);
  };

  return (
    <TableRow>
      <TableCell>
        {id} ({bid})
      </TableCell>
      <TableCell>
        <Slider
          aria-label={`player ${id} bid`}
          min={MIN_BID}
          max={MAX_BID}
          value={bid}
          valueLabelDisplay="auto"
          onChange={handleBid}
        />
      </TableCell>
      <TableCell align="right">
        <Switch
          checked={blind}
          inputProps={{ "aria-label": `P${id} Blind Nil` }}
          onChange={handleBlind}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        {canTrain ? (
          <Switch
            checked={train}
            inputProps={{ "aria-label": `P${id} Trains` }}
            onChange={handleTrain}
            size="small"
          />
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default BidPlayerRow;
