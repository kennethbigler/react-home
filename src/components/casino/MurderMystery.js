import React from 'react';
import profile, { CASINO } from '../../constants/murder';
// https://react-table.js.org/#/story/readme
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import nl2br from 'react-newline-to-break';
// Parents: Main

export const MurderMystery = () => {
  // names
  let columns = [
    { Header: 'Role', accessor: 'role', minWidth: 114, maxWidth: 223 },
    {
      Header: 'Importance',
      accessor: 'importance',
      minWidth: 30,
      maxWidth: 121
    },
    { Header: 'Gender', accessor: 'gender', minWidth: 37, maxWidth: 56 },
    { Header: 'Player', accessor: 'person', width: 75 },
    {
      Header: 'Character Description',
      accessor: 'description',
      minWidth: 100,
      style: { whiteSpace: 'normal' },
      Cell: row => nl2br(row.value)
    },
    {
      Header: 'Your Clue to Share',
      accessor: 'clue',
      minWidth: 100,
      style: { whiteSpace: 'normal' },
      Cell: row => nl2br(row.value)
    },
    {
      Header: 'Hints it Might be You',
      accessor: 'hint',
      minWidth: 100,
      style: { whiteSpace: 'normal' },
      Cell: row => nl2br(row.value)
    }
  ];

  // styling for when the table gets too large
  const styles = {
    position: 'absolute',
    top: 140,
    left: 15,
    right: 15
  };

  const defaultSort = [{ id: 'importance', desc: false }];

  return (
    <div>
      <h2>Murder at {CASINO}</h2>
      <ReactTable
        className="-striped -highlight"
        defaultPageSize={profile.length}
        data={profile}
        columns={columns}
        resizable={false}
        showPagination={false}
        style={styles}
        defaultSortDesc
        defaultSorted={defaultSort}
      />
    </div>
  );
};
