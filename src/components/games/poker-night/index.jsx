import React from 'react';
// https://react-table.js.org/#/story/readme
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// functions
import keys from 'lodash/keys';
import forEach from 'lodash/forEach';
import isNumber from 'lodash/isNumber';
import includes from 'lodash/includes';
import scores from './poker';
// Parents: Main

const pokerKeys = [];

function getTotal(obj) {
  let total = 0;
  forEach(keys(obj.scores), (k) => {
    total += Number.isNaN(obj.scores[k]) ? 0 : obj.scores[k];
    if (!includes(pokerKeys, k)) {
      pokerKeys.push(k);
      pokerKeys.sort(
        (a, b) => parseInt(a.substr(1), 10) - parseInt(b.substr(1), 10),
      );
    }
  });
  obj.total = total;
}

const PokerNight = () => {
  // sort the names
  const PN = [...scores].sort((a, b) => {
    if (!a.total) {
      getTotal(a);
    }
    if (!b.total) {
      getTotal(b);
    }
    return a.total - b.total;
  });

  // names
  const columns = [
    {
      Header: 'Player',
      accessor: 'name',
      minWidth: 63,
      Footer: 'Error',
    },
  ];

  // all scores
  let totalErrorMargin = 0;
  forEach(pokerKeys, (k) => {
    // calculate error margin
    let err = 0;
    forEach(PN, (p) => {
      const score = p.scores[k];
      err += isNumber(score) ? score : 0;
    });
    totalErrorMargin += err;

    const Footer = (
      <span>
        {err}
      </span>
    );

    // add the column to the table
    columns.push({
      Header: k,
      accessor: `scores.${k}`,
      minWidth: 43,
      maxWidth: 160,
      Footer,
    });
  });

  const Footer = (
    <span>
      {totalErrorMargin}
    </span>
  );

  // total score (added next to names)
  columns.splice(1, 0, {
    id: 'total',
    Header: 'Total',
    minWidth: 50,
    accessor: 'total',
    Footer,
  });

  // styling for when the table gets too large
  const styles = {
    position: 'absolute',
    top: 79,
    left: 15,
    right: 15,
  };

  const defaultSort = [{ id: 'total', desc: true }];

  return (
    <ReactTable
      className="-striped -highlight"
      columns={columns}
      data={PN}
      defaultPageSize={PN.length}
      defaultSortDesc
      defaultSorted={defaultSort}
      resizable={false}
      showPagination={false}
      style={styles}
    />
  );
};

export default PokerNight;
