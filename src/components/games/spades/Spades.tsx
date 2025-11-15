import { memo } from "react";
import ControlBar from "./control-bar/ControlBar";
import ScoreTable from "./ScoreTable";
import useSpades from "./useSpades";
import Header from "./Header";
import { Button } from "@mui/material";

const Spades = memo(() => {
  const {
    // Shared
    data,
    initials,
    // Header
    wins1,
    wins2,
    // Reset Button
    newGame,
    // ControlBar
    first,
    lastBid,
    addBid,
    addPenalty,
    addScore,
  } = useSpades();

  // ControlBar doesn't have access to data, calculate out here
  let i = data.length - 1;
  if (data[i]?.score1 === undefined) {
    i -= 1;
  }
  // set vars
  const score1 = data[i]?.score1 || 0;
  const bags1 = data[i]?.bags1 || 0;
  const score2 = data[i]?.score2 || 0;
  const bags2 = data[i]?.bags2 || 0;
  // see if blind trade is possible
  const diff = score1 * 10 + bags1 - (score2 * 10 + bags2);
  const blindTrade = diff > 0 ? Math.floor(diff / 100) : Math.ceil(diff / 100);

  return (
    <>
      <Header initials={initials} wins1={wins1} wins2={wins2} />
      {score1 >= 100 || score2 >= 100 ? (
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
          blindTrade={blindTrade}
          first={first}
          initials={initials}
          lastBid={lastBid}
          showPenalty={data[0]?.score1 !== undefined}
          onBidSave={addBid}
          onPenalty={addPenalty}
          onScoreSave={addScore}
        />
      )}
      <ScoreTable initials={initials} data={data} />
    </>
  );
});

Spades.displayName = "Spades";

export default Spades;
