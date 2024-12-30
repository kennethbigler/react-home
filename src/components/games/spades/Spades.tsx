import * as React from "react";
import { useAtom, useAtomValue } from "jotai";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";
import ControlBar from "./control-bar/ControlBar";
import ScoreTable from "./ScoreTable";
import playerAtom from "../../../jotai/player-atom";
import scoreboardAtom, { Bid, defaultBid } from "../../../jotai/spades-atom";
import getScore from "./helpers";

const Spades = React.memo(() => {
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
    // can't add bid if bid already exists, or if someone won
    if (data[data.length - 1] && data[data.length - 1]?.score1 === undefined) {
      return;
    }
    // convert bid to storage data format
    const newData = [...data];
    const newEntry = {
      start: initials[first],
      bid: bids.reduce((acc, b) => {
        if (b.train) {
          return acc + "🚂";
        } else if (b.blind) {
          return acc + "🦮";
        } else if (b.bid === 0) {
          return acc + "🚫";
        } else if (b.bid >= 10) {
          return acc + `,${b.bid},`;
        } else {
          return acc + b.bid.toString();
        }
      }, ""),
    };
    newData.push(newEntry);
    // update first player and add data entry
    setScoreboard({ first, lastBid: bids, data: newData });
  };

  /** calculates and adds score1 and score2 finishing data entry */
  const addScore = (mades: [number, number, number, number]) => {
    // can't add scores if no bid exists
    if (data[data.length - 1]?.score1 !== undefined) {
      return;
    }
    // convert made tricks to scores
    const newData = [...data];
    const { score1, bags1, score2, bags2 } = data[data.length - 2] || {};
    // calculate scores
    const { score: newScore1, bags: newBags1 } = getScore(
      { ...lastBid[0], made: mades[0] },
      { ...lastBid[2], made: mades[2] },
      score1 || 0,
      bags1 || 0,
    );
    const { score: newScore2, bags: newBags2 } = getScore(
      { ...lastBid[1], made: mades[1] },
      { ...lastBid[3], made: mades[3] },
      score2 || 0,
      bags2 || 0,
    );
    // update scores in data entry
    newData[data.length - 1] = {
      ...data[data.length - 1],
      score1: newScore1,
      bags1: newBags1,
      score2: newScore2,
      bags2: newBags2,
    };
    setScoreboard({
      first: (first + 1) % 4,
      lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
      data: newData,
    });
  };

  const newGame = () =>
    setScoreboard({
      first,
      lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
      data: [],
    });

  return (
    <>
      <div className="flex-container">
        <Typography variant="h2" component="h1">
          ♠️ Scores
        </Typography>
        <PlayerMenu />
      </div>
      {(data[data.length - 1]?.score1 || 0) >= 100 ||
      (data[data.length - 1]?.score2 || 0) >= 100 ? (
        <Button
          fullWidth
          color="error"
          onClick={newGame}
          variant="contained"
          sx={{ marginTop: 2 }}
        >
          Reset
        </Button>
      ) : (
        <ControlBar
          first={first}
          initials={initials}
          lastBid={lastBid}
          onBidSave={addBid}
          onScoreSave={addScore}
        />
      )}

      <ScoreTable initials={initials} data={data} />
    </>
  );
});

Spades.displayName = "Spades";

export default Spades;
