import * as React from "react";
import { useAtom, useAtomValue } from "jotai";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";
import ControlBar from "./control-bar/ControlBar";
import ScoreTable from "./score-table/ScoreTable";
import playerAtom from "../../../jotai/player-atom";
import scoreboardAtom, { Bid } from "../../../jotai/spades-score-atom";

const Scorecard = React.memo(() => {
  const players = useAtomValue(playerAtom);
  const [{ first, lastBid, data }, setScoreboard] = useAtom(scoreboardAtom);

  const initials: [string, string, string, string] = [
    players[0].name[0],
    players[1].name[0],
    players[2].name[0],
    players[3].name[0],
  ];

  /** sets a new data entry with first and bid info of data, updates first */
  const addBid = (bids: [Bid, Bid, Bid, Bid]) => {
    // can't add bid if bid already exists
    if (data[data.length - 1] && data[data.length - 1]?.score1 === undefined) {
      return;
    }
    // convert bid to storage data format
    const newData = [...data];
    const newEntry = {
      first: initials[first],
      bid: bids.reduce((acc, b) => {
        if (b.train) {
          return acc + "🚂";
        } else if (b.blind) {
          return acc + "🦮";
        } else if (b.bid === 0) {
          return acc + "-";
        } else {
          return acc + b.bid.toString();
        }
      }, ""),
    };
    newData.push(newEntry);
    // update first player and add data entry
    setScoreboard({ first: (first + 1) % 4, lastBid: bids, data: newData });
  };

  /** TODO: Enable edit bids */
  // const editBid = () => {};

  /** calculates and adds score1 and score2 finishing data entry */
  // const addScore = () => {};

  return (
    <>
      <div className="flex-container">
        <Typography variant="h2" component="h1">
          ♠️ Scores
        </Typography>
        <PlayerMenu />
      </div>
      <ControlBar initials={initials} onBidSave={addBid} lastBid={lastBid} />
      <ScoreTable initials={initials} data={data} />
    </>
  );
});

Scorecard.displayName = "Scorecard";

export default Scorecard;
