import React from 'react';

const styles = { separator: { borderRight: '1px solid lightgray' } };

// list of countries visited, broken down by region
const NA = [
  'Bahamas',
  'British Virgin Islands',
  'Canada',
  'Cayman Islands',
  'Mexico',
  'U.S. Virgin Islands',
  'United States'
];
const EU = [
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Gibraltar',
  'Greece',
  'Iceland',
  'Ireland',
  'Italy',
  'Malta',
  'Monaco',
  'Netherlands',
  'Norway',
  'Portugal',
  'Russia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey',
  'United Kingdom',
  'Vatican'
];

// ratio to display on table, 2:1 seemed to look best
const EURatio = 2;
// export array of <li> elements for display
export let countries = [];
// iterate to the end of the longer list
const len = Math.max(NA.length, Math.ceil(EU.length / EURatio));
for (let i = 0; i < len; i += 1) {
  let row = [];
  // add NA Country
  row.push(
    <td key={`tmc${i}`} style={styles.separator}>
      {NA[i]}
    </td>
  );
  // add EU Countries
  for (let j = 0; j < EURatio; j += 1) {
    row.push(<td key={`tmc${i}${j}`}>{EU[EURatio * i + j]}</td>);
  }
  // form the row
  countries.push(<tr key={`tmr${i}`}>{row}</tr>);
}
