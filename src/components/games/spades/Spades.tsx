import { memo } from "react";
import ControlBar from "./control-bar/ControlBar";
import ScoreTable from "./ScoreTable";
import useSpades from "./helpers/useSpades";
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
    showReset,
    // ControlBar
    first,
    lastBid,
    blindTrade,
    scoreText,
    showPenalty,
    addBid,
    addPenalty,
    addScore,
  } = useSpades();

  return (
    <>
      <Header initials={initials} wins1={wins1} wins2={wins2} />
      {showReset ? (
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
          scoreText={scoreText}
          lastBid={lastBid}
          showPenalty={showPenalty}
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
