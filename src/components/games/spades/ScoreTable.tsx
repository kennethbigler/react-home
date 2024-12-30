import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ScoreRow } from "../../../jotai/spades-atom";

interface ScoreTableProps {
  initials: [string, string, string, string];
  data: ScoreRow[];
}

const getScoreText = (score?: number) => {
  if (score === undefined || score === 0) {
    return "";
  } else if (score > 0) {
    return `${score > 100 ? "🎉 " : ""}${score}`;
  } else {
    return `${score}0 + `;
  }
};

const ScoreTable = ({ initials, data }: ScoreTableProps) => (
  <Table aria-label="Bid Table">
    <TableHead>
      <TableRow>
        <TableCell width={"10%"}>🥇</TableCell>
        <TableCell>
          Bid
          <br />({initials[0] + initials[1] + initials[2] + initials[3]})
        </TableCell>
        <TableCell>{initials[0] + initials[2]}</TableCell>
        <TableCell>{initials[1] + initials[3]}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((s, i) => (
        <TableRow key={i}>
          <TableCell>{s.start}</TableCell>
          <TableCell>{s.bid}</TableCell>
          <TableCell>
            {getScoreText(s.score1)}
            {s.bags1}
          </TableCell>
          <TableCell>
            {getScoreText(s.score2)}
            {s.bags2}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ScoreTable;
