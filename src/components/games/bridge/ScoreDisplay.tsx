import { useAtomValue } from "jotai";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import bridgeAtom, { bridgeRead } from "@/jotai/bridge-atom";

const border = `4px solid ${grey[700]}`;

const ScoreDisplay = () => {
  const { aboveScores, weBelow, theyBelow, weRubbers, theyRubbers, bids } =
    useAtomValue(bridgeAtom);
  const { weVulnerable, theyVulnerable, weSum, theySum } =
    useAtomValue(bridgeRead);

  // `bids` is a single flat list with one entry appended per saved hand, in the
  // same order as the weBelow/theyBelow arrays.  Above-the-line scores, however,
  // are grouped by game, so to label a hand in game `i` we need its index into
  // the flat list = (hands in all earlier games) + position within this game.
  const gameBidOffset = (gameIndex: number): number =>
    aboveScores.slice(0, gameIndex).reduce((sum, [we]) => sum + we.length, 0);

  return (
    <Table aria-label="Bridge Scores" sx={{ border }}>
      <TableHead>
        <TableRow sx={{ borderBottom: border }}>
          <TableCell align="center" sx={{ borderRight: border }}>
            We {weVulnerable && "🥇"}
          </TableCell>
          <TableCell align="center">They {theyVulnerable && "🥇"}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {aboveScores
          .slice()
          .map(
            ([we, they], i) =>
              (we.length > 0 ||
                they.length > 0 ||
                (we.length === 0 && they.length === 0 && i === 0)) && (
                <TableRow key={`game-${i}`}>
                  <TableCell align="center" sx={{ borderRight: border }}>
                    {we.map(
                      (score, j) =>
                        score !== 0 && (
                          <Typography key={`we-above-${j}`} component="div">
                            {`${score} (${bids[gameBidOffset(i) + j]})`}
                          </Typography>
                        ),
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {they.map(
                      (score, j) =>
                        score !== 0 && (
                          <Typography key={`they-above-${j}`} component="div">
                            {`${score} (${bids[gameBidOffset(i) + j]})`}
                          </Typography>
                        ),
                    )}
                  </TableCell>
                </TableRow>
              ),
          )
          .reverse()}
        <TableRow sx={{ borderTop: border }}>
          <TableCell align="center" sx={{ borderRight: border }}>
            {weBelow.map(
              (score, i) =>
                score !== 0 && (
                  <Typography key={`we-below-${i}`} component="div">
                    {`${score} (${bids[i]})`}
                  </Typography>
                ),
            )}
          </TableCell>
          <TableCell align="center">
            {theyBelow.map(
              (score, i) =>
                score !== 0 && (
                  <Typography key={`they-below-${i}`} component="div">
                    {`${score} (${bids[i]})`}
                  </Typography>
                ),
            )}
          </TableCell>
        </TableRow>
        <TableRow sx={{ borderBottom: border }}>
          <TableCell align="center" sx={{ border }}>
            Total: {weSum}
          </TableCell>
          <TableCell align="center" sx={{ border }}>
            Total: {theySum}
          </TableCell>
        </TableRow>
        <TableRow sx={{ borderBottom: border }}>
          <TableCell align="center" sx={{ border }}>
            Wins: {weRubbers}
          </TableCell>
          <TableCell align="center" sx={{ border }}>
            Wins: {theyRubbers}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ScoreDisplay;
