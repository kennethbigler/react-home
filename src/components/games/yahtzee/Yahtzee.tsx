import { memo, useCallback } from "react";
import { useAtomValue } from "jotai";
import Typography from "@mui/material/Typography";
import ScoreTable from "./score-table/ScoreTable";
import { ADD_DICE, BottomGameScore } from "./types";
import Header from "./Header";
import TableHeader from "./TableHeader";
import { Dice, yahtzeeRead } from "../../../jotai/yahtzee-state";
import useYahtzeeState from "./use-yahtzee-state";

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

const Yahtzee = memo(() => {
  const { state, diceClick, newGame, updateTop, updateBottom, updateRoll } =
    useYahtzeeState();

  const {
    topScores,
    bottomScores,
    values,
    saved,
    roll,
    showScoreButtons,
    bestScore,
    lastScore,
    money,
  } = state;

  const { topSum, bottomSum, finalTopSum, finish, name } =
    useAtomValue(yahtzeeRead);

  const handleDiceRoll = (): void => {
    if (finish) {
      newGame(finalTopSum + bottomSum);
      return;
    }
    if (roll >= 3) {
      return;
    }

    const newValues = [...values];
    const newSaved = [...saved];

    for (let i = 0; i < newValues.length; i += 1) {
      newValues[i] = (Math.floor(Math.random() * 6) + 1) as Dice;
    }
    newValues.sort();
    newSaved.sort();
    updateRoll(
      newValues,
      newSaved,
      (roll + 1) as Dice,
      bottomSum + topSum === 0 && roll === 0,
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
    diceClick(newValues, newSaved);
  };

  const handleUnsave = (i: number): void => {
    const newValues = [...values];
    const newSaved = [...saved];
    newValues.push(newSaved.splice(i, 1)[0]);
    newValues.sort();
    diceClick(newValues, newSaved);
  };

  const getButtonText = useCallback(
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
    [finish],
  );

  const handleTopScore = (points: number, i: number): void => {
    const newTopScores = [...topScores];
    newTopScores[i] = points;
    updateTop(newTopScores);
  };

  const handleBottomScore = (points: number, i: number): void => {
    const newBottomScores = [...bottomScores];
    newBottomScores[i] = points;
    updateBottom(newBottomScores);
  };

  const top = topScores.map((score, i) => ({ ...topConstants[i], score }));
  const bottom = bottomScores.map((score, i) => ({
    ...bottomConstants[i],
    score,
  })) as BottomGameScore[];

  return (
    <>
      <Header
        bestScore={bestScore}
        lastScore={lastScore}
        money={money}
        name={name}
      />
      <hr aria-hidden />
      <TableHeader
        values={values}
        saved={saved}
        roll={roll}
        handleUnsave={handleUnsave}
        handleSave={handleSave}
        handleDiceRoll={handleDiceRoll}
        getButtonText={getButtonText}
      />
      <hr aria-hidden />
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
});

Yahtzee.displayName = "Yahtzee";

export default Yahtzee;
