import React from 'react';
import PN from '../../constants/poker';
// https://react-table.js.org/#/story/readme
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const PokerNight = () => {
  // names
  let columns = [{ Header: 'Player', accessor: 'name' }];
  // all scores
  Object.keys(PN[0].scores).forEach((k, i) => {
    columns.push({ Header: `Night ${i + 1}`, accessor: `scores.${k}` });
  });
  // total score
  columns.push({
    id: 'total',
    Header: 'Total',
    accessor: s => {
      let ret = 0;
      Object.keys(s.scores).forEach(k => (ret += s.scores[k]));
      return ret;
    }
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
