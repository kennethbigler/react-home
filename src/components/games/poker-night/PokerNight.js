import React from 'react';
import scores from './poker';
// https://react-table.js.org/#/story/readme
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// Parents: Main

let keys = [];

function getTotal(obj) {
  let total = 0;
  Object.keys(obj.scores).forEach(k => {
    total += isNaN(obj.scores[k]) ? 0 : obj.scores[k];
    if (keys.indexOf(k) === -1) {
      keys.push(k);
      keys.sort();
    }
  });
  obj.total = total;
}

export const PokerNight = () => {
  // sort the names
  let PN = [...scores].sort((a, b) => {
    if (!a.total) {
      getTotal(a);
    }
    if (!b.total) {
      getTotal(b);
    }
    return a.total - b.total;
  });

  // names
  let columns = [
    { Header: 'Player', accessor: 'name', minWidth: 63, Footer: 'Error' }
  ];

  // all scores
  let totalErrorMargin = 0;
  keys.forEach(k => {
    // calculate error margin
    let err = 0;
    PN.forEach(p => (err += isNaN(p.scores[k]) ? 0 : p.scores[k]));
    totalErrorMargin += err;
    // add the column to the table
    columns.push({
      Header: k,
      accessor: `scores.${k}`,
      minWidth: 40,
      maxWidth: 160,
      Footer: <span>{err}</span>
    });
  });

  // total score (added next to names)
  columns.splice(1, 0, {
    id: 'total',
    Header: 'Total',
    minWidth: 50,
    accessor: 'total',
    Footer: <span>{totalErrorMargin}</span>
  });

  // styling for when the table gets too large
  const styles = {
    position: 'absolute',
    top: 79,
    left: 15,
    right: 15
  };

  const defaultSort = [{ id: 'total', desc: true }];

  return (
    <ReactTable
      className="-striped -highlight"
      defaultPageSize={PN.length}
      data={PN}
      columns={columns}
      resizable={false}
      showPagination={false}
      style={styles}
      defaultSortDesc
      defaultSorted={defaultSort}
    />
  );
};
