import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";
import ControlBar from "./control-bar/ControlBar";
import ScoreTable from "./ScoreTable";
import useSpades from "./useSpades";

const Spades = React.memo(() => {
  const { first, lastBid, data, initials, addBid, addScore, newGame } =
    useSpades();

  let i = data.length - 1;
  if (data[i]?.score1 === undefined) {
    i -= 1;
  }
  const diff = (data[i]?.score1 || 0) - (data[i]?.score2 || 0);
  const blindTrade = diff > 0 ? Math.floor(diff / 10) : Math.ceil(diff / 10);

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
          blindTrade={blindTrade}
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
