import React from 'react';
import PN from '../../constants/poker';
// https://react-table.js.org/#/story/readme
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const PokerNight = () => {
  // names
  let columns = [{ Header: 'Player', accessor: 'name', minWidth: 60 }];
  let totalErrorMargin = 0;
  // all scores
  Object.keys(PN[0].scores).forEach((k, i) => {
    // calculate error margin
    let err = 0;
    PN.forEach(p => (err += isNaN(p.scores[k]) ? 0 : p.scores[k]));
    totalErrorMargin += err;
    // add the column to the table
    columns.push({
      Header: `W${i + 1}`,
      accessor: `scores.${k}`,
      minWidth: 40,
      Footer: (
        <span>
          <strong>Err:</strong> {err}
        </span>
      )
    });
  });

  // total score
  columns.push({
    id: 'total',
    Header: 'Total',
    minWidth: 50,
    accessor: s => {
      let ret = 0;
      Object.keys(s.scores).forEach(
        k => (ret += isNaN(s.scores[k]) ? 0 : s.scores[k])
      );
      return ret;
    },
    Footer: (
      <span>
        <strong>Err:</strong> {totalErrorMargin}
      </span>
    )
  });

  const styles = {
    // position: 'absolute',
    // top: 79,
    // bottom: 15,
    // left: 15,
    // right: 15
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

export default PokerNight;
