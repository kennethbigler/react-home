import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

type AboveScores = [
  [number[], number[]],
  [number[], number[]],
  [number[], number[]],
];
// TODO: replace with connected data at some point
const aboveScores: AboveScores = [
  [[40, 20, 40], []],
  [
    [30, 50],
    [20, 40],
  ],
  [[], []],
];
const weBelow = [60, 80];
const theyBelow = [80, 60];

const border = `4px solid ${grey[700]}`;

const ScoreDisplay = () => {
  const weVulnerable =
    aboveScores[0][0].reduce((acc, n) => acc + n, 0) >= 100 ||
    aboveScores[1][0].reduce((acc, n) => acc + n, 0) >= 100;
  const theyVulnerable =
    aboveScores[0][1].reduce((acc, n) => acc + n, 0) >= 100 ||
    aboveScores[1][1].reduce((acc, n) => acc + n, 0) >= 100;

  return (
    <Table aria-label="Bridge Scores" sx={{ border }}>
      <TableHead>
        <TableRow sx={{ borderBottom: border }}>
          <TableCell align="center" sx={{ borderRight: border }}>
            We {weVulnerable && "⚠️"}
          </TableCell>
          <TableCell align="center">They {theyVulnerable && "⚠️"}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {aboveScores
          .slice()
          .reverse()
          .map(
            ([we, they], i) =>
              (we.length > 0 || they.length > 0) && (
                <TableRow key={`game-${i}`}>
                  <TableCell align="center" sx={{ borderRight: border }}>
                    {we.map((score, i) => (
                      <Typography key={`we-above-${i}`} component="div">
                        {score}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {they.map((score, i) => (
                      <Typography key={`they-above-${i}`} component="div">
                        {score}
                      </Typography>
                    ))}
                  </TableCell>
                </TableRow>
              ),
          )}
        <TableRow sx={{ borderTop: border }}>
          <TableCell align="center" sx={{ borderRight: border }}>
            {weBelow.map((score, i) => (
              <Typography key={`we-below-${i}`} component="div">
                {score}
              </Typography>
            ))}
          </TableCell>
          <TableCell align="center">
            {theyBelow.map((score, i) => (
              <Typography key={`they-below-${i}`} component="div">
                {score}
              </Typography>
            ))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ScoreDisplay;
