import React from 'react';
import PropTypes from 'prop-types';
// Parents: Help

/** render code for each class */
export const HelpHead = props => {
  const { name } = props;
  return (
    <thead className="thead-dark">
      <tr>
        <th colSpan="11">{name}</th>
      </tr>
    </thead>
  );
};

HelpHead.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  name: PropTypes.string.isRequired
};
