import { ChangeEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { MAX_BID, MIN_BID } from "../../../../jotai/spades-atom";

interface AddBidPlayerProps {
  id: string;
  blindTrade: number;
  canTrain?: boolean;
  bid: number;
  blind: boolean;
  train: boolean;
  onBid: (bid: number, blind: boolean, train: boolean) => void;
}

const AddBidPlayer = ({
  id,
  blindTrade,
  canTrain,
  bid,
  blind,
  train,
  onBid,
}: AddBidPlayerProps) => {
  const decrBid = () => onBid(Math.max(bid - 1, MIN_BID), false, false);
  const incrBid = () => onBid(Math.min(bid + 1, MAX_BID), false, false);

  const handleBlind = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) =>
    onBid(bid, checked, false);

  const handleTrain = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) =>
    onBid(bid, false, checked);

  return (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell align="center">
        <IconButton onClick={decrBid} disabled={bid <= MIN_BID}>
          <Remove />
        </IconButton>
        {bid}
        <IconButton onClick={incrBid} disabled={bid >= MAX_BID}>
          <Add />
        </IconButton>
      </TableCell>
      <TableCell align="right">
        <Switch
          checked={blind}
          slotProps={{ input: { "aria-label": `P${id} Blind Nil` } }}
          onChange={handleBlind}
          size="small"
        />
        {blindTrade || blind ? blindTrade : ""}
      </TableCell>
      <TableCell align="right">
        {canTrain ? (
          <Switch
            checked={train}
            slotProps={{ input: { "aria-label": `P${id} Trains` } }}
            onChange={handleTrain}
            size="small"
          />
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default AddBidPlayer;
