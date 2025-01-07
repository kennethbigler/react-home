import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";
import ControlBar from "./control-bar/ControlBar";
import ScoreTable from "./ScoreTable";
import useSpades from "./useSpades";
import { Avatar, Chip } from "@mui/material";

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
      <div className="flex-container">
        <Typography variant="h2" component="h1">
          ♠️ Scores
        </Typography>
        <PlayerMenu />
      </div>
      <div className="flex-container">
        <Chip
          avatar={<Avatar>{initials[0] + initials[2]}</Avatar>}
          color={wins1 >= wins2 ? "success" : "error"}
          label={wins1}
        />
        <Chip
          avatar={<Avatar>💰</Avatar>}
          color="warning"
          label={`${initials[0]} ${bags[0]} | ${initials[1]} ${bags[1]} | ${initials[2]} ${bags[2]} | ${initials[3]} ${bags[3]}`}
        />
        <Chip
          avatar={<Avatar>{initials[1] + initials[3]}</Avatar>}
          color={wins2 >= wins1 ? "success" : "error"}
          label={wins2}
        />
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
