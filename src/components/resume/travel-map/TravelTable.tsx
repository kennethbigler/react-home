import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { NA, EU, cruises, lines, rcLoyalty } from "../../../constants/travel";

// --------------------     Styles     -------------------- //
const marginStyles: React.CSSProperties = { marginTop: 24, marginBottom: 16 };
const separatorStyles: React.CSSProperties = {
  borderRight: `1px solid ${grey[400]}`,
};
const cellStyles: React.CSSProperties = {
  padding: 5,
  textAlign: "center",
  whiteSpace: "normal",
  overflow: "visible",
};

// --------------------     Countries Table     -------------------- //
// ratio to display on table, 2:1 seemed to look best
const EURatio = 3;
// export array of <li> elements for display
const countries: React.ReactNode[] = [];
// iterate to the end of the longer list
const len = Math.max(NA.length, Math.ceil(EU.length / EURatio));
for (let i = 0; i < len; i += 1) {
  const row = [];
  // add NA Country
  row.push(
    <TableCell key={`tmc${i}`} style={{ ...cellStyles, ...separatorStyles }}>
      {NA[i]}
    </TableCell>
  );
  // add EU Countries
  for (let j = 0; j < EURatio; j += 1) {
    row.push(
      <TableCell key={`tmc${i}${j}`} style={cellStyles}>
        {EU[EURatio * i + j]}
      </TableCell>
    );
  }
  // form the row
  const countryRow = <TableRow key={`tmr${i}`}>{row}</TableRow>;
  countries.push(countryRow);
}

// --------------------     Cruise Table     -------------------- //
let totalNights = 0;
let disneyCruises = 0;
let rcNights = 0;

const cruiseCells = cruises.map((cruise, i) => {
  totalNights += cruise.nights;

  switch (cruise.line) {
    case lines[0]:
      disneyCruises += 1;
      break;
    case lines[1]:
      rcNights += cruise.nights * (cruise.concierge ? 2 : 1);
      break;
    default:
      break;
  }

  return (
    <TableRow key={`cruise-tr-${i}`}>
      <TableCell key={`cruise-td-description-${i}`} style={cellStyles}>
        {cruise.name}
      </TableCell>
      <TableCell key={`cruise-td-ship-${i}`} style={cellStyles}>
        {cruise.line} {cruise.ship}
      </TableCell>
      <TableCell key={`cruise-td-nights-${i}`} style={cellStyles}>
        {cruise.nights} {cruise.concierge ? "⭐️" : ""}
      </TableCell>
      <TableCell key={`cruise-td-departure-${i}`} style={cellStyles}>
        {cruise.departure.format("MMMM Y")}
      </TableCell>
    </TableRow>
  );
});

let rcNextLevel = 0;
let rcStatus = "N/A";

rcLoyalty.forEach(({ nights, status }, i) => {
  if (rcNights >= nights) {
    rcStatus = status;
    rcNextLevel = rcLoyalty[i + 1].nights;
  }
});

// --------------------     Travel Map     -------------------- //
const TravelMap: React.FC = React.memo(() => (
  <>
    <Typography variant="h4" style={marginStyles}>
      {`I have been to ${NA.length + EU.length} countries:`}
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ ...cellStyles, ...separatorStyles }}>
            North America
          </TableCell>
          <TableCell colSpan={EURatio} style={cellStyles}>
            Europe
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{countries}</TableBody>
    </Table>

    <Typography variant="h4" style={marginStyles}>
      {`I have been on ${cruises.length} cruises:`}
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          {/* Disney */}
          <TableCell style={cellStyles}>{lines[0]}</TableCell>
          {/* Royal Caribbean */}
          <TableCell style={cellStyles}>{lines[1]}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {/* Disney */}
          <TableCell style={cellStyles}>
            {disneyCruises} / 10 Cruises = Platinum
          </TableCell>
          {/* Royal Caribbean */}
          <TableCell style={cellStyles}>
            {rcNights} / {rcNextLevel} Nights = {rcStatus}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <br />
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={cellStyles}>Description 📍</TableCell>
          <TableCell style={cellStyles}>Ship 🚢</TableCell>
          <TableCell style={cellStyles}>Nights ({totalNights} 🌙)</TableCell>
          <TableCell style={cellStyles}>Departure 🗓</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{cruiseCells}</TableBody>
    </Table>
  </>
));

export default TravelMap;
