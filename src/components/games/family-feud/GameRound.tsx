import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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

const GameRound = ({
  answers,
  scores,
  question,
  onScore1,
  onScore2,
  modifier = 1,
}: GameRoundProps) => {
  const [strikes, setStrikes] = useState([false, false, false]);
  const [buttonsL, setButtonsL] = useState(["1", "2", "3", "4"]);
  const [buttonsR, setButtonsR] = useState(["5", "6", "7", "8"]);
  const [score, setScore] = useState(0);

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

  const handleTeam1Click = () => onScore1(score * modifier);
  const handleTeam2Click = () => onScore2(score * modifier);

  return (
    <div>
      <Typography variant="body1" fontStyle="italic">
        {question}
      </Typography>
      <hr aria-hidden />
      <Typography variant="h4" component="h3" align="center">
        Points: {score * modifier}
      </Typography>
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
      <Typography variant="h4" component="h3">
        Which Team Won?
      </Typography>
      <Stack direction="row" justifyContent="space-around">
        <Button variant="contained" onClick={handleTeam1Click}>
          Team 1
        </Button>
        <Button variant="contained" onClick={handleTeam2Click}>
          Team 2
        </Button>
      </Stack>
    </div>
  );
};

export default GameRound;
