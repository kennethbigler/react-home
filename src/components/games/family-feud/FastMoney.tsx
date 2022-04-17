import React from "react";
import Stack from "@mui/material/Stack";
import FastMoneyTable from "./FastMoneyTable";
import { sum } from "./helpers";

interface FastMoneyProps {
  questions: string[];
  answers: string[][];
  scores: number[][];
}

const FastMoney = (props: FastMoneyProps) => {
  const { questions, answers, scores } = props;

  const [scoresL, setScoresL] = React.useState([0, 0, 0, 0, 0]);
  const [scoresR, setScoresR] = React.useState([0, 0, 0, 0, 0]);
  const [answerIndexL, setAnswerIndexL] = React.useState([-2, -2, -2, -2, -2]);
  const [answerIndexR, setAnswerIndexR] = React.useState([-2, -2, -2, -2, -2]);

  const handleClickL = (questionIdx: number, answerIdx: number) => () => {
    // set answer index
    const newAnswerIndex = [...answerIndexL];
    newAnswerIndex[questionIdx] = answerIdx;
    setAnswerIndexL(newAnswerIndex);
    // set scores
    if (answerIdx >= 0) {
      const newScores = [...scoresL];
      newScores[questionIdx] = scores[questionIdx][answerIdx];
      setScoresL(newScores);
    }
  };

  const handleClickR = (questionIdx: number, answerIdx: number) => () => {
    // set answer index
    const newAnswerIndex = [...answerIndexR];
    newAnswerIndex[questionIdx] = answerIdx;
    setAnswerIndexR(newAnswerIndex);
    // set scores
    if (answerIdx >= 0) {
      const newScores = [...scoresR];
      newScores[questionIdx] = scores[questionIdx][answerIdx];
      setScoresR(newScores);
    }
  };

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing={2}>
          <FastMoneyTable
            answerIndex={answerIndexL}
            answers={answers}
            scores={scoresL}
            questions={questions}
            onClick={handleClickL}
          />
        </Stack>
        <Stack spacing={2}>
          <FastMoneyTable
            takenAnswerIndex={answerIndexL}
            answerIndex={answerIndexR}
            answers={answers}
            scores={scoresR}
            onClick={handleClickR}
          />
        </Stack>
      </Stack>
      <h3 style={{ textAlign: "center" }}>
        Total: {scoresR.reduce(sum, scoresL.reduce(sum, 0))}
      </h3>
    </div>
  );
};

export default FastMoney;
