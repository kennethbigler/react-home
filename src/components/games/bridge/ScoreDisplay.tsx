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
import bridgeAtom, { bridgeRead } from "../../../jotai/bridge-atom";

const border = `4px solid ${grey[700]}`;

const ScoreDisplay = () => {
  const { aboveScores, weBelow, theyBelow, weRubbers, theyRubbers } =
    useAtomValue(bridgeAtom);
  const { weVulnerable, theyVulnerable, weSum, theySum } =
    useAtomValue(bridgeRead);

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
          )
          .reverse()}
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
