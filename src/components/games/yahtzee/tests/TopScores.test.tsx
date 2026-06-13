import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import TopScores from "../score-table/TopScores";

describe("games | yahtzee | TopScores", () => {
  const sx = {};

  it("shows 0 bonus when topSum < 63", () => {
    render(
      <Table>
        <TableBody>
          <TopScores topSum={42} finalTopSum={42} sx={sx} />
        </TableBody>
      </Table>,
    );
    // Bonus cell shows 0 (not 35)
    const cells = screen.getAllByRole("cell");
    const bonusCell = cells.find((c) => c.textContent === "0");
    expect(bonusCell).toBeInTheDocument();
    expect(screen.queryByText("35")).not.toBeInTheDocument();
  });

  it("shows 35 bonus when topSum >= 63", () => {
    render(
      <Table>
        <TableBody>
          <TopScores topSum={63} finalTopSum={98} sx={sx} />
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("63")).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();
  });
});
