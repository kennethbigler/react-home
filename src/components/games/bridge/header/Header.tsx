import { memo } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Button, Typography } from "@mui/material";
import BidDialog from "./bid-dialog/BidDialog";
import ScoreDialog from "./score-dialog/ScoreDialog";
import bridgeAtom, {
  bridgeRead,
  newBridgeGame,
} from "../../../../jotai/bridge-atom";

const Header = memo(() => {
  const { gameIdx, weWins, theyWins, weSum, theySum } =
    useAtomValue(bridgeRead);
  const [{ weRubbers, theyRubbers }, setState] = useAtom(bridgeAtom);

  const handleNewGame = () => {
    let newWeRubbers = weRubbers;
    let newTheyRubbers = theyRubbers;
    const weWon = weWins >= theyWins;
    let weTotal = weSum;
    let theyTotal = theySum;
    if (weWon) {
      weTotal += theyWins === 0 ? 700 : 500;
    } else {
      theyTotal += weWins === 0 ? 700 : 500;
    }

    if (weTotal > theyTotal) {
      newWeRubbers += 1;
    } else if (theyTotal > weTotal) {
      newTheyRubbers += 1;
    } else {
      if (weWon) {
        newWeRubbers += 1;
      } else {
        newTheyRubbers += 1;
      }
    }
    setState({
      weRubbers: newWeRubbers,
      theyRubbers: newTheyRubbers,
      ...newBridgeGame(),
    });
  };

  return (
    <div className="flex-container">
      <Typography variant="h2" component="h1">
        🌉
      </Typography>
      <BidDialog />
      {(gameIdx > 2 || weWins >= 2 || theyWins >= 2) && (
        <Button variant="contained" color="warning" onClick={handleNewGame}>
          New Game
        </Button>
      )}
      <ScoreDialog />
    </div>
  );
});

Header.displayName = "Header";

export default Header;
