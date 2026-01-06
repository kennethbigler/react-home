import { memo, CSSProperties, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { cruises, totalNights } from "../../../../constants/cruises";
import { grey } from "@mui/material/colors";

// --------------------     Styles     -------------------- //
const cellStyles: CSSProperties = {
  padding: 5,
  textAlign: "center",
  whiteSpace: "normal",
  overflow: "visible",
};

// --------------------     Render     -------------------- //
const CruiseTable = memo(() => (
  <Table aria-label="cruises I have been on">
    <TableHead>
      <TableRow>
        <TableCell style={cellStyles}>Ship 🚢</TableCell>
        <TableCell style={cellStyles}>Destination 📍</TableCell>
        <TableCell style={cellStyles}>Nights ({totalNights}&nbsp;🌙)</TableCell>
        <TableCell style={cellStyles}>1st 🥇</TableCell>
        <TableCell style={cellStyles}>Month 🗓</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {cruises.map((cruise, i) => (
        <Fragment key={`cruise-tr-${i}`}>
          {(i === 0 ||
            cruise.departure.year > cruises[i - 1].departure.year) && (
            <TableRow sx={{ borderTop: `2px solid ${grey[400]}` }}>
              <TableCell style={cellStyles} colSpan={5}>
                <Typography variant="h6">{cruise.departure.year}</Typography>
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
              {cruise.concierge ? "🥇" : ""}
            </TableCell>
            <TableCell
              style={cellStyles}
              title={cruise.departure.format("MMMM")}
            >
              {cruise.departure.format("MM")} {cruise.departure.format("M")}
            </TableCell>
          </TableRow>
        </Fragment>
      ))}
    </TableBody>
  </Table>
));

CruiseTable.displayName = "CruiseTable";

export default CruiseTable;
