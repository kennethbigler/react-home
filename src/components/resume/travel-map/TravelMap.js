import React from 'react';
import { NA, EU } from '../../../constants/countries';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import { grey400 } from 'material-ui/styles/colors';
// Parents: Main

export const TravelMap = () => {
  // external links
  const imgUrl = () => {
    window.open(
      'https://matadornetwork.com/travel-map/33db2343800e0aa83a1d102fc8d07f5a-1518204154'
    );
  };
  const travelMap =
    'https://d36tnp772eyphs.cloudfront.net/travel-maps/33db2343800e0aa83a1d102fc8d07f5a-1518204154/my-travel-map.png';

  const styles = {
    img: {
      display: 'block',
      margin: 'auto',
      width: '100%',
      maxWidth: '792px',
      cursor: 'pointer'
    },
    margins: { marginTop: 24, marginBottom: 16 },
    cell: {
      padding: 5,
      textAlign: 'center',
      whiteSpace: 'normal',
      overflow: 'visible'
    },
    separator: { borderRight: `1px solid ${grey400}` }
  };

  // ratio to display on table, 2:1 seemed to look best
  const EURatio = 3;

  // export array of <li> elements for display
  let countries = [];
  // iterate to the end of the longer list
  const len = Math.max(NA.length, Math.ceil(EU.length / EURatio));
  for (let i = 0; i < len; i += 1) {
    let row = [];
    // add NA Country
    row.push(
      <TableRowColumn
        key={`tmc${i}`}
        style={{ ...styles.cell, ...styles.separator }}
      >
        {NA[i]}
      </TableRowColumn>
    );
    // add EU Countries
    for (let j = 0; j < EURatio; j += 1) {
      row.push(
        <TableRowColumn key={`tmc${i}${j}`} style={styles.cell}>
          {EU[EURatio * i + j]}
        </TableRowColumn>
      );
    }
    // form the row
    countries.push(<TableRow key={`tmr${i}`}>{row}</TableRow>);
  }

  return (
    <div>
      <h1>Ken's Travel Map</h1>
      <hr />
      <img
        onClick={imgUrl}
        src={travelMap}
        style={styles.img}
        alt="Ken’s Travel Map"
      />
      <h3 style={styles.margins}>Ken has been to:</h3>
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={{ ...styles.cell, ...styles.separator }}>
              North America
            </TableHeaderColumn>
            <TableHeaderColumn colSpan={EURatio} style={styles.cell}>
              Europe
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{countries}</TableBody>
      </Table>
    </div>
  );
};
