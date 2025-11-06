import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import AddBidPlayer from "./AddBidPlayer";
import { Bids, defaultBid } from "../../../../jotai/spades-atom";

interface AddBidProps {
  blindTrade: number;
  first: number;
  initials: string;
  onBidSave: (bids: Bids) => void;
}

const getBlindTrade = (blindTrade: number, n: number) =>
  (blindTrade < 0 && (n === 0 || n === 2)) ||
  (blindTrade > 0 && (n === 1 || n === 3))
    ? Math.min(Math.abs(blindTrade), 3)
    : 0;

const AddBid = ({ blindTrade, first, initials, onBidSave }: AddBidProps) => {
  const [bids, setBids] = useState<Bids>([
    defaultBid,
    defaultBid,
    defaultBid,
    defaultBid,
  ]);

  const a = (first + 0) % 4;
  const b = (first + 1) % 4;
  const c = (first + 2) % 4;
  const d = (first + 3) % 4;

  const handleBid =
    (n: number) => (bid: number, blind: boolean, train: boolean) => {
      let newBid = { bid, blind, train };
      if (blind) {
        newBid = { bid: 0, blind, train: false };
      } else if (train) {
        let trainBid = 10;
        switch (n) {
          case a:
            trainBid -= bids[c].bid;
            break;
          case b:
            trainBid -= bids[d].bid;
            break;
          case c:
            trainBid -= bids[a].bid;
            break;
          case d:
          default:
            trainBid -= bids[b].bid;
        }
        newBid = {
          bid: trainBid,
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
            <TableCell width={"40%"} align="center">
              Bid ({bags} 💰)
            </TableCell>
            <TableCell width={"20%"} align="center">
              🦮
            </TableCell>
            <TableCell width={"20%"} align="center">
              🚂
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AddBidPlayer
            id={initials[a] + " 🥇"}
            {...bids[a]}
            onBid={handleBid(a)}
            blindTrade={getBlindTrade(blindTrade, a)}
          />
          <AddBidPlayer
            id={initials[b]}
            {...bids[b]}
            onBid={handleBid(b)}
            blindTrade={getBlindTrade(blindTrade, b)}
          />
          <AddBidPlayer
            canTrain={0 < bids[a].bid && bids[a].bid < 10}
            id={initials[c]}
            {...bids[c]}
            blindTrade={getBlindTrade(blindTrade, c)}
            onBid={handleBid(c)}
          />
          <AddBidPlayer
            canTrain={0 < bids[b].bid && bids[b].bid < 10}
            id={initials[d] + " 🃏"}
            {...bids[d]}
            blindTrade={getBlindTrade(blindTrade, d)}
            onBid={handleBid(d)}
          />
        </TableBody>
      </Table>
    </InfoPopup>
  );
};

export default AddBid;
