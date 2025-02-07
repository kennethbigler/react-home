import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { cruises, totalNights } from "../../../../constants/cruises";
import { FormControl, Switch, Typography } from "@mui/material";

// --------------------     Styles     -------------------- //
const cellStyles: React.CSSProperties = {
  padding: 5,
  textAlign: "center",
  whiteSpace: "normal",
  overflow: "visible",
};

const cruiseCells = cruises.map((cruise, i) => (
  <TableRow key={`cruise-tr-${i}`}>
    <TableCell style={cellStyles} component="th" scope="row">
      {cruise.line} {cruise.ship}
    </TableCell>
    <TableCell style={cellStyles}>{cruise.name}</TableCell>
    <TableCell style={cellStyles}>{cruise.nights}</TableCell>
    <TableCell style={cellStyles}>{cruise.concierge ? "⭐️" : ""}</TableCell>
    <TableCell style={cellStyles}>
      {cruise.departure.format("MMMM Y")}
    </TableCell>
  </TableRow>
));

// --------------------     Render     -------------------- //
const CruiseTable = React.memo(() => {
  const [isText, setIsText] = React.useState(true);
  const updateText = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setIsText(e.target.checked);

  return (
    <>
      <FormControl
        sx={{ flexDirection: "row", alignItems: "center", margin: "10px 0" }}
      >
        <Typography>🐙</Typography>
        <Switch
          checked={isText}
          inputProps={{ "aria-label": "toggle text" }}
          onChange={updateText}
        />
        <Typography>Text</Typography>
      </FormControl>
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
        <TableBody>{cruiseCells}</TableBody>
      </Table>
    </>
  );
});

CruiseTable.displayName = "CruiseTable";

export default CruiseTable;
