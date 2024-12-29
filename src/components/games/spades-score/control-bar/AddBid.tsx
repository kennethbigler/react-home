import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import BidPlayerRow from "./BidPlayerRow";
import { Bids, defaultBid } from "../../../../jotai/spades-score-atom";

interface AddBidProps {
  initials: [string, string, string, string];
  onBidSave: (bids: Bids) => void;
}

const AddBid = ({ initials, onBidSave }: AddBidProps) => {
  const [bids, setBids] = React.useState<Bids>([
    defaultBid,
    defaultBid,
    defaultBid,
    defaultBid,
  ]);

  const handleBid =
    (n: number) => (bid: number, blind: boolean, train: boolean) => {
      let newBid = { bid, blind, train };
      if (blind) {
        newBid = { bid: 0, blind, train: false };
      } else if (train) {
        newBid = {
          bid: 10 - (n === 2 ? bids[0].bid : bids[1].bid),
          blind: false,
          train,
        };
      } else {
        newBid = { bid, blind: false, train: false };
      }
      const newBids: Bids = [...bids];
      newBids[n] = newBid;
      setBids(newBids);
    };

  const handleSave = () => {
    onBidSave(bids);
    setBids([defaultBid, defaultBid, defaultBid, defaultBid]);
  };

  const bags = bids.reduce((acc, bid) => acc - bid.bid, 13);

  return (
    <InfoPopup title="+ Bid" onSave={handleSave}>
      <Table aria-label="Bid Table" padding="none">
        <TableHead>
          <TableRow>
            <TableCell width={"20%"}>P</TableCell>
            <TableCell width={"50%"}>
              Bid ({bags} Bag{bags !== 1 ? "s" : ""})
            </TableCell>
            <TableCell width={"15%"} align="center">
              🦮
            </TableCell>
            <TableCell width={"15%"} align="center">
              🚂
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <BidPlayerRow id={initials[0]} {...bids[0]} onBid={handleBid(0)} />
          <BidPlayerRow id={initials[1]} {...bids[1]} onBid={handleBid(1)} />
          <BidPlayerRow
            canTrain={0 < bids[0].bid && bids[0].bid < 10}
            id={initials[2]}
            {...bids[2]}
            onBid={handleBid(2)}
          />
          <BidPlayerRow
            canTrain={0 < bids[1].bid && bids[1].bid < 10}
            id={initials[3]}
            {...bids[3]}
            onBid={handleBid(3)}
          />
        </TableBody>
      </Table>
    </InfoPopup>
  );
};

export default AddBid;
