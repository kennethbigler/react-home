import { ScoreRow } from "../../../jotai/spades-atom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface ScoreTableProps {
  initials: string;
  data: ScoreRow[];
}

const getScoreText = (score?: number, comp?: number) => {
  if (score === undefined || comp === undefined || score === 0) {
    return "";
  } else if (score > 0) {
    return `${score >= 100 && score >= comp ? "🎉 " : ""}${score}`;
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
          <TableCell
            padding={i === data.length - 1 ? "none" : undefined}
            align="center"
          >
            {s.start}
            {i === data.length - 1 && (s.score1 ? "🃏" : "🥇")}
          </TableCell>
          <TableCell>{s.bid}</TableCell>
          <TableCell>
            {getScoreText(s.score1, s.score2)}
            {s.bags1}
            {s.mod1 && ` (${s.mod1})`}
          </TableCell>
          <TableCell>
            {getScoreText(s.score2, s.score1)}
            {s.bags2}
            {s.mod2 && ` (${s.mod2})`}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ScoreTable;
