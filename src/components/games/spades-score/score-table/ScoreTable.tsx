import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ScoreRow } from "../../../../jotai/spades-score-atom";

interface ScoreTableProps {
  initials: [string, string, string, string];
  data: ScoreRow[];
}

const getScoreDisplay = (score?: number) => {
  if (score === undefined || score === 0) {
    return "";
  } else if (score > 0) {
    return score.toString();
  } else {
    return `${score}0 + `;
  }
};

const ScoreTable = ({ initials, data }: ScoreTableProps) => {
  return (
    <Table aria-label="Bid Table">
      <TableHead>
        <TableRow>
          <TableCell width={"10%"}>🥇</TableCell>
          <TableCell width={"20%"}>Bid</TableCell>
          <TableCell width={"35%"} align="center">
            {initials[0] + initials[2]}
          </TableCell>
          <TableCell width={"35%"} align="center">
            {initials[1] + initials[3]}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((s, i) => (
          <TableRow key={i}>
            <TableCell>{s.start}</TableCell>
            <TableCell>{s.bid}</TableCell>
            <TableCell align="center">
              {getScoreDisplay(s.score1)}
              {s.bags1}
            </TableCell>
            <TableCell align="center">
              {getScoreDisplay(s.score2)}
              {s.bags2}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScoreTable;
