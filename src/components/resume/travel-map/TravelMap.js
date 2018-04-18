import React from 'react';
import { countries } from './countries';
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
    margins: { marginTop: 24, marginBottom: 16 }
  };

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
