import React from 'react';
import { Row } from './Row';
import PropTypes from 'prop-types';
// Parents: Help

/** render code for each class */
export const HelpBody = props => {
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];
  const cardRow = cards.map(c => <td key={c}>{c}</td>);

  const { arr } = props;

  return (
    <tbody>
      <tr>
        <td rowSpan="2">
          Your<br />Hand
        </td>
        <td colSpan="10">Dealer</td>
      </tr>
      <tr>{cardRow}</tr>
      {arr.map(obj => <Row key={obj.name} {...obj} />)}
    </tbody>
  );
};

HelpBody.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  arr: PropTypes.array.isRequired
};
