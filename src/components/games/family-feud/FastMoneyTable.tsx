import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { sum } from "./helpers";

interface FastMoneyProps {
  answerIndex: number[];
  answers: string[][];
  scores: number[];
  questions?: string[];
  takenAnswerIndex?: number[];
  onClick: (
    questionIndex: number,
    answerIndex: number,
  ) => React.MouseEventHandler;
}

const FastMoney = ({
  answerIndex,
  answers,
  scores,
  questions,
  takenAnswerIndex,
  onClick,
}: FastMoneyProps) => (
  <TableContainer component={Paper}>
    <Table aria-label="simple table">
      <TableBody>
        {scores.map((score, i) => (
          <TableRow
            key={i}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            {questions && <TableCell>{questions[i]}</TableCell>}
            <TableCell component="th" scope="row">
              {answers[i].map((ans, j) =>
                !ans ||
                (answerIndex[i] !== -2 && answerIndex[i] !== j) ||
                (takenAnswerIndex && takenAnswerIndex[i] === j) ? null : (
                  <Button
                    variant={answerIndex[i] === j ? "contained" : "outlined"}
                    key={j}
                    onClick={onClick(i, j)}
                    title={ans}
                  >
                    {answerIndex[i] === j ? ans : j + 1}
                  </Button>
                ),
              )}
              {answerIndex[i] < 0 && (
                <Button
                  variant={answerIndex[i] === -1 ? "contained" : "outlined"}
                  onClick={onClick(i, -1)}
                  title="Wrong"
                >
                  0
                </Button>
              )}
            </TableCell>
            <TableCell align="right">{score}</TableCell>
          </TableRow>
        ))}
        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
          <TableCell colSpan={questions ? 2 : 1}>Total</TableCell>
          <TableCell align="right">{scores.reduce(sum, 0)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default FastMoney;
