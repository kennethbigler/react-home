import { CSSProperties } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { grey } from "@mui/material/colors";
import Cell from "./Cell";

interface BoardProps {
  board: string[] | null[];
  onClick: (cell: number) => void;
  winRow: [number?, number?, number?];
}

const tableCellStyle: CSSProperties = {
  padding: 0,
  textAlign: "center",
  border: `1px solid ${grey[400]}`,
};

const Board = ({ board, onClick, winRow }: BoardProps) => {
  const cells = [];
  // create 3 rows
  for (let i = 0; i < 3; i += 1) {
    // create 3 cells in a row
    const row = [];
    for (let j = 0; j < 3; j += 1) {
      const c = i * 3 + j;
      // check if winning position
      const winner = winRow.includes(c);
      row.push(
        <TableCell key={`${i},${j}`} style={tableCellStyle}>
          <Cell
            onClick={(): void => onClick(c)}
            value={board[c]}
            winner={winner}
          />
        </TableCell>,
      );
    }
    const boardRow = <TableRow key={`row${i}`}>{row}</TableRow>;
    // separate into rows
    cells.push(boardRow);
  }

  return (
    <Table aria-label="game of Tik Tac Toe in a 3 by 3 grid">
      <TableBody>{cells}</TableBody>
    </Table>
  );
};

export default Board;
