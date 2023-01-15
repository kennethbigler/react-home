import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {
  cruises,
  lines,
  rcLoyalty,
  disneyLoyalty,
} from "../../../constants/travel";

// --------------------     Styles     -------------------- //
const marginStyles: React.CSSProperties = { marginTop: 24, marginBottom: 16 };
const cellStyles: React.CSSProperties = {
  padding: 5,
  textAlign: "center",
  whiteSpace: "normal",
  overflow: "visible",
};

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

let disneyNextLevel = 0;
let disneyStatus = "N/A";

disneyLoyalty.forEach(({ num, status }, i) => {
  if (disneyCruises >= num) {
    disneyStatus = status;
    disneyNextLevel = disneyLoyalty[i + 1].num;
  }
});

// --------------------     Travel Map     -------------------- //
const TravelMap: React.FC = React.memo(() => (
  <>
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
            {disneyCruises} / {disneyNextLevel} Cruises = {disneyStatus}
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
