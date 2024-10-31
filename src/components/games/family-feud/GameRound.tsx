import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

interface GameRoundProps {
  answers: string[];
  scores: number[];
  question: string;
  onScore1: (score: number) => void;
  onScore2: (score: number) => void;
  modifier?: number;
}

const wrapperStyles = {
  width: "100%",
  maxWidth: 400,
};

const GameRound = (props: GameRoundProps) => {
  const { answers, scores, question, onScore1, onScore2, modifier = 1 } = props;

  const [strikes, setStrikes] = React.useState([false, false, false]);
  const [buttonsL, setButtonsL] = React.useState(["1", "2", "3", "4"]);
  const [buttonsR, setButtonsR] = React.useState(["5", "6", "7", "8"]);
  const [score, setScore] = React.useState(0);

  const handleStrikeClick = (strikeNum: number) => () => {
    const newStrikes = [...strikes];
    newStrikes[strikeNum] = !strikes[strikeNum];
    setStrikes(newStrikes);
  };

  const handleAnswerClick = (answerNum: number) => () => {
    const isL = answerNum < 4;
    const newAnswers = isL ? [...buttonsL] : [...buttonsR];
    newAnswers[answerNum % 4] = `${answers[answerNum]} - ${scores[answerNum]}`;
    if (isL) {
      setButtonsL(newAnswers);
    } else {
      setButtonsR(newAnswers);
    }
    setScore(score + scores[answerNum]);
  };

  return (
    <div>
      <i>{question}</i>
      <hr aria-hidden />
      <h3 style={{ textAlign: "center" }}>Points: {score * modifier}</h3>
      <hr aria-hidden />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing={2} style={wrapperStyles}>
          {buttonsL.map((content: string, i: number) =>
            !answers[i] ? (
              <Button variant="contained" key={`${content}-${i}`} disabled>
                -
              </Button>
            ) : (
              <Button
                variant="contained"
                key={`${content}-${i}`}
                onClick={handleAnswerClick(i)}
              >
                {content}
              </Button>
            ),
          )}
        </Stack>
        <Stack spacing={2} style={wrapperStyles}>
          {buttonsR.map((content: string, i: number) =>
            !answers[i + 4] ? (
              <Button variant="contained" key={`${content}-${i}`} disabled>
                -
              </Button>
            ) : (
              <Button
                variant="contained"
                key={`${content}-${i}`}
                onClick={handleAnswerClick(i + 4)}
              >
                {content}
              </Button>
            ),
          )}
        </Stack>
      </Stack>
      <br />
      <hr aria-hidden />
      <Stack direction="row" justifyContent="space-around">
        {strikes.map((isStrike, i) => (
          <Button
            variant="contained"
            color={isStrike ? "error" : "primary"}
            onClick={handleStrikeClick(i)}
            key={`Button${i}`}
          >
            X
          </Button>
        ))}
      </Stack>
      <hr aria-hidden />
      <h3>Which Team Won?</h3>
      <Stack direction="row" justifyContent="space-around">
        <Button variant="contained" onClick={() => onScore1(score * modifier)}>
          Team 1
        </Button>
        <Button variant="contained" onClick={() => onScore2(score * modifier)}>
          Team 2
        </Button>
      </Stack>
    </div>
  );
};

export default GameRound;
