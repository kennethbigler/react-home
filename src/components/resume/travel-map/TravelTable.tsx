import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import DarkTableCell from '../../common/dark-table-cell/DarkTableCell';
import { NA, EU } from '../../../constants/countries';

const marginStyles: React.CSSProperties = { marginTop: 24, marginBottom: 16 };
const separatorStyles: React.CSSProperties = { borderRight: `1px solid ${grey[400]}` };
const cellStyles: React.CSSProperties = {
  padding: 5,
  textAlign: 'center',
  whiteSpace: 'normal',
  overflow: 'visible',
};

// ratio to display on table, 2:1 seemed to look best
const EURatio = 3;
// export array of <li> elements for display
const countries: React.ReactNodeArray = [];
// iterate to the end of the longer list
const len = Math.max(NA.length, Math.ceil(EU.length / EURatio));
for (let i = 0; i < len; i += 1) {
  const row = [];
  // add NA Country
  row.push(
    <TableCell
      key={`tmc${i}`}
      style={{ ...cellStyles, ...separatorStyles }}
    >
      {NA[i]}
    </TableCell>,
  );
  // add EU Countries
  for (let j = 0; j < EURatio; j += 1) {
    row.push(
      <TableCell key={`tmc${i}${j}`} style={cellStyles}>
        {EU[EURatio * i + j]}
      </TableCell>,
    );
  }
  // form the row
  const countryRow = (
    <TableRow key={`tmr${i}`}>
      {row}
    </TableRow>
  );
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
          <DarkTableCell style={{ ...cellStyles, ...separatorStyles }}>
            North America
          </DarkTableCell>
          <DarkTableCell colSpan={EURatio} style={cellStyles}>
            Europe
          </DarkTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {countries}
      </TableBody>
    </Table>
  </>
));

export default TravelMap;
