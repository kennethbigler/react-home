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

const cruiseCells = cruises.map((cruise, i) => (
  <TableRow key={`cruise-tr-${i}`}>
    <TableCell
      key={`cruise-td-ship-${i}`}
      style={cellStyles}
      component="th"
      scope="row"
    >
      {cruise.line} {cruise.ship}
    </TableCell>
    <TableCell key={`cruise-td-description-${i}`} style={cellStyles}>
      {cruise.name}
    </TableCell>
    <TableCell key={`cruise-td-nights-${i}`} style={cellStyles}>
      {cruise.nights} {cruise.concierge ? "⭐️" : ""}
    </TableCell>
    <TableCell key={`cruise-td-departure-${i}`} style={cellStyles}>
      {cruise.departure.format("MMMM Y")}
    </TableCell>
  </TableRow>
));

// --------------------     Render     -------------------- //
const CruiseTable = React.memo(() => (
  <Table aria-label="cruises I have been on">
    <TableHead>
      <TableRow>
        <TableCell style={cellStyles}>Ship&nbsp;🚢</TableCell>
        <TableCell style={cellStyles}>Description&nbsp;📍</TableCell>
        <TableCell style={cellStyles}>Nights ({totalNights}&nbsp;🌙)</TableCell>
        <TableCell style={cellStyles}>Departure&nbsp;🗓</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>{cruiseCells}</TableBody>
  </Table>
));

CruiseTable.displayName = "CruiseTable";

export default CruiseTable;
