import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import {
  cruises,
  lines,
  rcLoyalty,
  disneyLoyalty,
  princessLoyalty,
  virginLoyalty,
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
let virginCruises = 0;
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
    case lines[3]:
      virginCruises += 1;
      break;
    default:
      break;
  }

  return (
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

// Disney
let virginNextLevel = 0;
let virginStatus = "N/A";

virginLoyalty.forEach(({ num, status }, i) => {
  if (virginCruises >= num) {
    virginStatus = status;
    virginNextLevel =
      virginLoyalty[Math.min(i + 1, virginLoyalty.length - 1)].num;
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
    <Typography variant="h3">Loyalty Programs</Typography>
    <Table aria-label="cruises I have been on">
      <TableHead>
        <TableRow>
          {/* Disney */}
          <TableCell style={cellStyles}>{lines[0]}</TableCell>
          {/* Royal Caribbean */}
          <TableCell style={cellStyles}>{lines[1]}</TableCell>
          {/* Princess */}
          <TableCell style={cellStyles}>{lines[2]}</TableCell>
          {/* Virgin */}
          <TableCell style={cellStyles}>{lines[3]}</TableCell>
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
          {/* Virgin */}
          <TableCell style={cellStyles}>
            🛳&nbsp;{virginCruises}&nbsp;/&nbsp;{virginNextLevel} ={" "}
            {virginStatus}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Typography variant="h3" style={{ marginTop: 20 }}>
      Cruises
    </Typography>
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
