import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { cruises, totalNights } from "../../../../constants/cruises";

// --------------------     Styles     -------------------- //
const cellStyles: React.CSSProperties = {
  padding: 5,
  textAlign: "center",
  whiteSpace: "normal",
  overflow: "visible",
};

// --------------------     Render     -------------------- //
const CruiseTable = React.memo(() => {
  let lastYear = 2000;

  return (
    <Table aria-label="cruises I have been on">
      <TableHead>
        <TableRow>
          <TableCell style={cellStyles}>Ship 🚢</TableCell>
          <TableCell style={cellStyles}>Destination 📍</TableCell>
          <TableCell style={cellStyles}>
            Nights ({totalNights}&nbsp;🌙)
          </TableCell>
          <TableCell style={cellStyles}>1st ⭐️</TableCell>
          <TableCell style={cellStyles}>Date 🗓</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {cruises.map((cruise, i) => {
          const showYear = cruise.departure.year > lastYear;
          lastYear = cruise.departure.year;
          return (
            <React.Fragment key={`cruise-tr-${i}`}>
              {showYear && (
                <TableRow>
                  <TableCell style={cellStyles} colSpan={5}>
                    {cruise.departure.year}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell style={cellStyles} component="th" scope="row">
                  {cruise.line} {cruise.ship}
                </TableCell>
                <TableCell style={cellStyles}>{cruise.name}</TableCell>
                <TableCell style={cellStyles}>{cruise.nights}</TableCell>
                <TableCell style={cellStyles}>
                  {cruise.concierge ? "⭐️" : ""}
                </TableCell>
                <TableCell style={cellStyles}>
                  {cruise.departure.format("MMMM")}
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
});

CruiseTable.displayName = "CruiseTable";

export default CruiseTable;
