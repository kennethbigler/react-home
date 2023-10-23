import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { americas, euNaf, asNau } from "../../../constants/travel";

// --------------------     Styles     -------------------- //
const marginStyles: React.CSSProperties = { marginTop: 24, marginBottom: 16 };
const separatorStyles: React.CSSProperties = {
  borderRight: `1px solid ${grey[400]}`,
};
const cellStyles: React.CSSProperties = {
  padding: "5px 1px",
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
const len = Math.max(
  americas.length,
  Math.ceil(euNaf.length / EURatio),
  asNau.length,
);
for (let i = 0; i < len; i += 1) {
  const row = [];
  // add Americas Country
  row.push(
    <TableCell
      key={`tmc${i}-americas`}
      style={{ ...cellStyles, ...separatorStyles }}
    >
      {americas[i]}
    </TableCell>,
  );
  // add EU or AF Countries
  for (let j = 0; j < EURatio; j += 1) {
    row.push(
      <TableCell
        key={`tmc${i}${j}-eu-af`}
        style={
          j === EURatio - 1 ? { ...cellStyles, ...separatorStyles } : cellStyles
        }
      >
        {euNaf[EURatio * i + j]}
      </TableCell>,
    );
  }
  // add AS or AU Country
  row.push(
    <TableCell key={`tmc${i}-as-au`} style={cellStyles}>
      {asNau[i]}
    </TableCell>,
  );
  // form the row
  const countryRow = <TableRow key={`tmr${i}`}>{row}</TableRow>;
  countries.push(countryRow);
}

// --------------------     Travel Map     -------------------- //
const TravelMap: React.FC = React.memo(() => (
  <>
    <Typography variant="h3" component="h2" style={marginStyles}>
      {`I have been to ${
        americas.length + euNaf.length + asNau.length
      } countries:`}
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ ...cellStyles, ...separatorStyles }}>
            The Americas
          </TableCell>
          <TableCell
            colSpan={EURatio}
            style={{ ...cellStyles, ...separatorStyles }}
          >
            Europe &amp; Africa
          </TableCell>
          <TableCell colSpan={EURatio} style={cellStyles}>
            Asia &amp; Australia
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{countries}</TableBody>
    </Table>
  </>
));

export default TravelMap;
