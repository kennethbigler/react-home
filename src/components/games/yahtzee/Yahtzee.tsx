import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import DiceAPI from "../../../apis/Dice";
import ScoreTable from "./score-table/ScoreTable";
import { ADD_DICE, BottomGameScore } from "./types";
import Header from "./Header";
import TableHeader from "./TableHeader";
import { DBRootState } from "../../../store/types";
import {
  addScore,
  diceClick,
  newGame,
  updateTop,
  updateBottom,
  updateRoll,
  Dice,
} from "../../../store/modules/yahtzee";
import getYahtzeeVars from "./helpers";

const topConstants = [
  { name: "Aces" },
  { name: "Twos" },
  { name: "Threes" },
  { name: "Fours" },
  { name: "Fives" },
  { name: "Sixes" },
];
const bottomConstants = [
  { name: "3 of a kind", hint: ADD_DICE, points: ADD_DICE },
  { name: "4 of a kind", hint: ADD_DICE, points: ADD_DICE },
  { name: "Full House", hint: "Score 25", points: 25 },
  { name: "Sm. Straight (4)", hint: "Score 30", points: 30 },
  { name: "Lg. Straight (5)", hint: "Score 40", points: 40 },
  { name: "Yahtzee", hint: "Score 50", points: 50 },
  { name: "Chance", hint: ADD_DICE, points: ADD_DICE },
];

const Yahtzee: React.FC = () => {
  const {
    topScores,
    bottomScores,
    values,
    saved,
    roll,
    showScoreButtons,
    scores,
  } = useSelector((state: DBRootState) => ({ ...state.yahtzee }));
  const dispatch = useDispatch();

  const { topSum, bottomSum, finalTopSum, finish } = getYahtzeeVars(
    topScores,
    bottomScores
  );

  const newYGame = (): void => {
    dispatch(addScore(finalTopSum + bottomSum));
    dispatch(newGame());
  };

  const handleDiceRoll = (): void => {
    if (finish) {
      newYGame();
      return;
    }
    if (roll >= 3) {
      return;
    }

    const newValues = [...values];
    const newSaved = [...saved];

    for (let i = 0; i < newValues.length; i += 1) {
      newValues[i] = DiceAPI.roll();
    }
    newValues.sort();
    newSaved.sort();
    dispatch(
      updateRoll({
        values: newValues,
        saved: newSaved,
        roll: (roll + 1) as Dice,
      })
    );
  };

  const handleSave = (i: number): void => {
    if (values[i] === 0) {
      return;
    }
    const newValues = [...values];
    const newSaved = [...saved];
    newSaved.push(newValues.splice(i, 1)[0]);
    newSaved.sort();
    dispatch(diceClick({ values: newValues, saved: newSaved }));
  };

  const handleUnsave = (i: number): void => {
    const newValues = [...values];
    const newSaved = [...saved];
    newValues.push(newSaved.splice(i, 1)[0]);
    newValues.sort();
    dispatch(diceClick({ values: newValues, saved: newSaved }));
  };

  const getButtonText = React.useCallback(
    (rollNum: Dice): string => {
      if (finish) {
        return "New Game";
      }

      switch (rollNum) {
        case 0:
          return "First Roll";
        case 1:
          return "Second Roll";
        case 2:
          return "Last Roll";
        case 3:
          return "Score";
        default:
          return "Error";
      }
    },
    [finish]
  );

  const handleTopScore = (points: number, i: number): void => {
    const newTopScores = [...topScores];
    newTopScores[i] = points;
    dispatch(updateTop(newTopScores));
  };

  const handleBottomScore = (points: number, i: number): void => {
    const newBottomScores = [...bottomScores];
    newBottomScores[i] = points;
    dispatch(updateBottom(newBottomScores));
  };

  const top = topScores.map((score, i) => ({ ...topConstants[i], score }));
  const bottom = bottomScores.map((score, i) => ({
    ...bottomConstants[i],
    score,
  })) as BottomGameScore[];

  return (
    <>
      <Header scores={scores} />
      <hr />
      <TableHeader
        values={values}
        saved={saved}
        roll={roll}
        handleUnsave={handleUnsave}
        handleSave={handleSave}
        handleDiceRoll={handleDiceRoll}
        getButtonText={getButtonText}
      />
      <hr />
      <Typography variant="h4">{`Total: ${
        finalTopSum + bottomSum
      }`}</Typography>
      <ScoreTable
        values={[...saved, ...values]}
        bottom={bottom}
        top={top}
        onTopScore={handleTopScore}
        onBottomScore={handleBottomScore}
        showScoreButtons={showScoreButtons}
        topSum={topSum}
        finalTopSum={finalTopSum}
        bottomSum={bottomSum}
      />
    </>
  );
};

export default Yahtzee;
