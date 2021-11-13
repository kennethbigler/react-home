import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { NA, EU } from "../../../constants/countries";

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
  </>
));

export default TravelMap;
