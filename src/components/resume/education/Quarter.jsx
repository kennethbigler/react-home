import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Class from './Class';
// Parents: Year

/* render code for each quarter */
const Quarter = (props) => {
  const { quarter } = props;
  return (
    <div>
      <h3>
        {quarter.quarter}
      </h3>
      <ul>
        {map(quarter.classes, c => <Class key={c.name} name={c.name} catalog={c.catalog} />)}
      </ul>
    </div>
  );
};

Quarter.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  quarter: types.shape({
    classes: types.arrayOf(types.shape({
      name: types.string.isRequired,
      catalog: types.string,
    })).isRequired,
    quarter: types.string.isRequired,
  }).isRequired,
};

export default Quarter;
