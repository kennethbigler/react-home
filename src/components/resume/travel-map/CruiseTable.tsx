import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  cruises,
  lines,
  rcLoyalty,
  disneyLoyalty,
  princessLoyalty,
} from "../../../constants/travel";

// --------------------     Styles     -------------------- //
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
const princess = [0, 0];

/**
 * Iterate over cruises to generate the table
 * and any needed data for cruise loyalty
 */
const cruiseCells = cruises.map((cruise, i) => {
  totalNights += cruise.nights;

  switch (cruise.line) {
    case lines[0]:
      disneyCruises += 1;
      break;
    case lines[1]:
      rcNights += cruise.nights * (cruise.concierge ? 2 : 1);
      break;
    case lines[2]:
      princess[0] += cruise.concierge ? 2 : 1;
      princess[1] += cruise.nights;
      break;
    default:
      break;
  }

  return (
    <TableRow key={`cruise-tr-${i}`}>
      <TableCell key={`cruise-td-ship-${i}`} style={cellStyles}>
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
  );
});

// --------------------     Cruise Loyalty     -------------------- //

// Royal Caribbean
let rcNextLevel = 0;
let rcStatus = "N/A";

rcLoyalty.forEach(({ nights, status }, i) => {
  if (rcNights >= nights) {
    rcStatus = status;
    rcNextLevel = rcLoyalty[Math.min(i + 1, rcLoyalty.length - 1)].nights;
  }
});

// Disney
let disneyNextLevel = 0;
let disneyStatus = "N/A";

disneyLoyalty.forEach(({ num, status }, i) => {
  if (disneyCruises >= num) {
    disneyStatus = status;
    disneyNextLevel =
      disneyLoyalty[Math.min(i + 1, disneyLoyalty.length - 1)].num;
  }
});

// Princess
let princessNextCruises = 0;
let princessNextNights = 0;
let princessStatus = "N/A";

princessLoyalty.forEach(({ num, nights, status }, i) => {
  if (princess[0] >= num || princess[1] >= nights) {
    princessStatus = status;
    princessNextCruises =
      princessLoyalty[Math.min(i + 1, princessLoyalty.length - 1)].num;
    princessNextNights =
      princessLoyalty[Math.min(i + 1, princessLoyalty.length - 1)].nights;
  }
});

// --------------------     Render     -------------------- //
const TravelMap: React.FC = React.memo(() => (
  <>
    <Table aria-label="cruises I have been on">
      <TableHead>
        <TableRow>
          {/* Disney */}
          <TableCell style={cellStyles}>{lines[0]}</TableCell>
          {/* Royal Caribbean */}
          <TableCell style={cellStyles}>{lines[1]}</TableCell>
          {/* Princess */}
          <TableCell style={cellStyles}>{lines[2]}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {/* Disney */}
          <TableCell style={cellStyles}>
            🛳&nbsp;{disneyCruises}&nbsp;/&nbsp;{disneyNextLevel} ={" "}
            {disneyStatus}
          </TableCell>
          {/* Royal Caribbean */}
          <TableCell style={cellStyles}>
            🌙&nbsp;{rcNights}&nbsp;/&nbsp;{rcNextLevel} = {rcStatus}
          </TableCell>
          {/* Princess */}
          <TableCell style={cellStyles}>
            🛳&nbsp;{princess[0]}&nbsp;/&nbsp;{princessNextCruises} - 🌙&nbsp;
            {princess[1]}&nbsp;/&nbsp;{princessNextNights} = {princessStatus}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <br />
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={cellStyles}>Ship&nbsp;🚢</TableCell>
          <TableCell style={cellStyles}>Description&nbsp;📍</TableCell>
          <TableCell style={cellStyles}>
            Nights ({totalNights}&nbsp;🌙)
          </TableCell>
          <TableCell style={cellStyles}>Departure&nbsp;🗓</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{cruiseCells}</TableBody>
    </Table>
  </>
));

export default TravelMap;
