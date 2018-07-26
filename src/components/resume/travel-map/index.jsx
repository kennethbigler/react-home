import React from 'react';
// material-ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import grey from '@material-ui/core/colors/grey';
import DarkTableCell from '../../common/DarkTableCell';
import { NA, EU } from '../../../constants/countries';
// Parents: Main

const TravelMap = () => {
  // external links
  const imgUrl = () => {
    window.open(
      'https://matadornetwork.com/travel-map/33db2343800e0aa83a1d102fc8d07f5a-1518204154',
    );
  };
  const travelMap = 'https://d36tnp772eyphs.cloudfront.net/travel-maps/03fbeadaffd678a201bed82831651905-1532004844/my-travel-map.png';

  const styles = {
    img: {
      display: 'block',
      margin: 'auto',
      width: '100%',
      maxWidth: '792px',
      cursor: 'pointer',
    },
    margins: { marginTop: 24, marginBottom: 16 },
    cell: {
      padding: 5,
      textAlign: 'center',
      whiteSpace: 'normal',
      overflow: 'visible',
    },
    separator: { borderRight: `1px solid ${grey[400]}` },
  };

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
    <div>
      <h1>
Ken&apos;s Travel Map
      </h1>
      <hr />
      <img
        alt="Ken’s Travel Map"
        onClick={imgUrl}
        src={travelMap}
        style={styles.img}
      />
      <h3 style={styles.margins}>
Ken has been to:
      </h3>
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
    </div>
  );
};

export default TravelMap;
