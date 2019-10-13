import React, { memo, Fragment } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import DarkTableCell from '../../common/DarkTableCell';
import styles from './TravelTable.styles';
import { NA, EU } from '../../../constants/countries';
// Parents: Main

const TravelMap = memo(() => {
  // ratio to display on table, 2:1 seemed to look best
  const EURatio = 3;

  // export array of <li> elements for display
  const countries = [];
  // iterate to the end of the longer list
  const len = Math.max(NA.length, Math.ceil(EU.length / EURatio));
  for (let i = 0; i < len; i += 1) {
    const row = [];
    // add NA Country
    row.push(
      <TableCell
        key={`tmc${i}`}
        style={{ ...styles.cell, ...styles.separator }}
      >
        {NA[i]}
      </TableCell>,
    );
    // add EU Countries
    for (let j = 0; j < EURatio; j += 1) {
      row.push(
        <TableCell key={`tmc${i}${j}`} style={styles.cell}>
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

  return (
    <>
      <Typography variant="h4" style={styles.margins}>
        {`I have been to ${NA.length + EU.length} countries:`}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <DarkTableCell style={{ ...styles.cell, ...styles.separator }}>
              North America
            </DarkTableCell>
            <DarkTableCell colSpan={EURatio} style={styles.cell}>
              Europe
            </DarkTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries}
        </TableBody>
      </Table>
    </>
  );
});

export default TravelMap;
