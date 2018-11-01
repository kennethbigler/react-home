import React from 'react';
// https://react-table.js.org/#/story/readme
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import nl2br from 'react-newline-to-break';
import profile, { CASINO } from './murder';
// Parents: Main

const MurderMystery = () => {
  // names
  const columns = [
    {
      Header: 'Role',
      accessor: 'role',
      minWidth: 109,
      maxWidth: 223,
      style: { whiteSpace: 'normal' },
    },
    {
      Header: 'Importance',
      accessor: 'importance',
      minWidth: 79,
      maxWidth: 121,
    },
    {
      Header: 'Gender',
      accessor: 'gender',
      minWidth: 37,
      maxWidth: 56,
    },
    {
      Header: 'Character Description',
      accessor: 'description',
      minWidth: 120,
      style: { whiteSpace: 'normal' },
      Cell: row => nl2br(row.value),
    },
    {
      Header: 'Your Clue to Share',
      accessor: 'clue',
      minWidth: 120,
      style: { whiteSpace: 'normal' },
      Cell: row => nl2br(row.value),
    },
    {
      Header: 'Hints it Might be You',
      accessor: 'hint',
      minWidth: 120,
      style: { whiteSpace: 'normal' },
      Cell: row => nl2br(row.value),
    },
  ];

  // styling for when the table gets too large
  const styles = {
    position: 'absolute',
    top: 155,
    bottom: 15,
    left: 15,
    right: 15,
  };

  const defaultSort = [{ id: 'importance', desc: false }];

  return (
    <div>
      <h2>
        {`Murder at ${CASINO}`}
      </h2>
      <ReactTable
        className="-striped -highlight"
        columns={columns}
        data={profile}
        defaultPageSize={profile.length}
        defaultSortDesc
        defaultSorted={defaultSort}
        showPagination={false}
        style={styles}
      />
    </div>
  );
};

export default MurderMystery;
