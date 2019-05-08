// react
import React, { memo } from 'react';
// components
// material-ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// colors
import green from '@material-ui/core/colors/green';
import teal from '@material-ui/core/colors/teal';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import Cell from './Cell';
import BlackjackTable from './BlackjackTable';
// Parents: Popup

const Help = memo(() => {
  // options
  const h = { color: green[200], text: 'H' };
  const d = { color: teal[200], text: 'D' };
  const s = { color: red[200], text: 'S' };
  const p = { color: orange[200], text: 'P' };
  const ds = { color: deepPurple[200], text: 'DS' };

  // algorithms for options
  const hardTtl = [
    { name: 'Hard 5', data: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 6', data: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 7', data: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 8', data: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 9', data: [h, d, d, d, d, h, h, h, h, h] },
    { name: 'Hard 10', data: [d, d, d, d, d, d, d, d, h, h] },
    { name: 'Hard 11', data: [d, d, d, d, d, d, d, d, d, d] },
    { name: 'Hard 12', data: [h, h, s, s, s, h, h, h, h, h] },
    { name: 'Hard 13', data: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 14', data: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 15', data: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 16', data: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 17', data: [s, s, s, s, s, s, s, s, s, s] },
    { name: 'Hard 18+', data: [s, s, s, s, s, s, s, s, s, s] },
  ];
  const softTtl = [
    { name: 'Ace + 2', data: [h, h, h, d, d, h, h, h, h, h] },
    { name: 'Ace + 3', data: [h, h, h, d, d, h, h, h, h, h] },
    { name: 'Ace + 4', data: [h, h, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 5', data: [h, h, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 6', data: [h, d, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 7', data: [ds, ds, ds, ds, ds, s, s, h, h, h] },
    { name: 'Ace + 8', data: [s, s, s, s, ds, s, s, s, s, s] },
    { name: 'Ace + 9', data: [s, s, s, s, s, s, s, s, s, s] },
  ];
  const pairs = [
    { name: '(2,2)', data: [p, p, p, p, p, p, h, h, h, h] },
    { name: '(3,3)', data: [p, p, p, p, p, p, h, h, h, h] },
    { name: '(4,4)', data: [h, h, h, p, p, h, h, h, h, h] },
    { name: '(5,5)', data: [d, d, d, d, d, d, d, d, h, h] },
    { name: '(6,6)', data: [p, p, p, p, p, h, h, h, h, h] },
    { name: '(7,7)', data: [p, p, p, p, p, p, h, h, h, h] },
    { name: '(8,8)', data: [p, p, p, p, p, p, p, p, p, p] },
    { name: '(9,9)', data: [p, p, p, p, p, s, p, p, s, s] },
    { name: '(T,T)', data: [s, s, s, s, s, s, s, s, s, s] },
    { name: '(A,A)', data: [p, p, p, p, p, p, p, p, p, p] },
  ];

  return (
    <div>
      <BlackjackTable data={hardTtl} title="Hard Totals" />
      <BlackjackTable data={softTtl} title="Soft Totals" />
      <BlackjackTable data={pairs} title="Pairs" />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan="11">
              Key
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <Cell {...h} />
            <Cell colSpan="2" text="= Hit" />
            <Cell {...s} />
            <Cell colSpan="3" text="= Stand" />
            <Cell {...p} />
            <Cell colSpan="3" text="= Split" />
          </TableRow>
          <TableRow>
            <Cell {...d} />
            <Cell colSpan="10" text="= Double (Hit if not allowed)" />
          </TableRow>
          <TableRow>
            <Cell {...ds} />
            <Cell colSpan="10" text="= Double (Stand if not allowed)" />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
});

export default Help;
