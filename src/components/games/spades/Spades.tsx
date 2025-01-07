import * as React from "react";
import Button from "@mui/material/Button";
import ControlBar from "./control-bar/ControlBar";
import ScoreTable from "./ScoreTable";
import useSpades from "./useSpades";
import Header from "./Header";

const Spades = React.memo(() => {
  const {
    // data
    bags,
    data,
    first,
    initials,
    lastBid,
    wins1,
    wins2,
    // functions
    addBid,
    addPenalty,
    addScore,
    newGame,
  } = useSpades();

  // ControlBar doesn't have access to data, calculate out here
  let i = data.length - 1;
  if (data[i]?.score1 === undefined) {
    i -= 1;
  }
  const diff =
    (data[i]?.score1 || 0) * 10 +
    (data[i]?.bags1 || 0) -
    ((data[i]?.score2 || 0) * 10 + (data[i]?.bags2 || 0));
  const blindTrade = diff > 0 ? Math.floor(diff / 100) : Math.ceil(diff / 100);

  return (
    <>
      <Header initials={initials} wins1={wins1} wins2={wins2} bags={bags} />
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
          blindTrade={blindTrade}
          first={first}
          initials={initials}
          lastBid={lastBid}
          showPenalty={!(data[i]?.score1 === undefined)}
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
