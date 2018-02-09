import React from 'react';
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

  const styles = {
    separator: { borderRight: '1px solid lightgray' },
    img: {
      display: 'block',
      margin: 'auto',
      width: '100%',
      maxWidth: '792px',
      cursor: 'pointer'
    },
    margins: { marginTop: 24, marginBottom: 16 }
  };

  const EURatio = 2;
  const len = Math.max(NA.length, Math.ceil(EU.length / EURatio));
  let countries = [];
  for (let i = 0; i < len; i += 1) {
    let row = [];
    // add NA Country
    row.push(<td style={styles.separator}>{NA[i]}</td>);
    // add EU Countries
    for (let j = 0; j < EURatio; j += 1) {
      row.push(<td>{EU[EURatio * i + j]}</td>);
    }
    // form the row
    countries.push(<tr>{row}</tr>);
  }

  return (
    <div>
      <h1>Ken's Travel Map</h1>
      <hr />
      <img
        onTouchTap={imgUrl}
        src={travelMap}
        style={styles.img}
        alt="Ken’s Travel Map"
      />
      <h3 style={styles.margins}>Ken has been to:</h3>
      <table className="table table-hover table-striped">
        <thead className="thead-dark">
          <tr>
            <th>North America</th>
            <th colSpan="3">Europe</th>
          </tr>
        </thead>
        <tbody>{countries}</tbody>
      </table>
    </div>
  );
};
