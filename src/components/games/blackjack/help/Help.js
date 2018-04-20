import React from 'react';
import { BlackjackTable } from './BlackjackTable';
import { Cell } from './Cell';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import * as colors from 'material-ui/styles/colors';
// Parents: Popup

/** render code for each class */
export const Help = () => {
  // options
  const h = { color: colors.green200, action: 'H' };
  const d = { color: colors.teal200, action: 'D' };
  const s = { color: colors.red200, action: 'S' };
  const p = { color: colors.orange200, action: 'P' };
  const ds = { color: colors.deepPurple200, action: 'DS' };

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
    { name: 'Hard 18+', data: [s, s, s, s, s, s, s, s, s, s] }
  ];
  const softTtl = [
    { name: 'Ace + 2', data: [h, h, h, d, d, h, h, h, h, h] },
    { name: 'Ace + 3', data: [h, h, h, d, d, h, h, h, h, h] },
    { name: 'Ace + 4', data: [h, h, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 5', data: [h, h, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 6', data: [h, d, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 7', data: [ds, ds, ds, ds, ds, s, s, h, h, h] },
    { name: 'Ace + 8', data: [s, s, s, s, ds, s, s, s, s, s] },
    { name: 'Ace + 9', data: [s, s, s, s, s, s, s, s, s, s] }
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
    { name: '(A,A)', data: [p, p, p, p, p, p, p, p, p, p] }
  ];

  return (
    <div>
      <BlackjackTable title="Hard Totals" data={hardTtl} />
      <BlackjackTable title="Soft Totals" data={softTtl} />
      <BlackjackTable title="Pairs" data={pairs} />
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn colSpan="11">Key</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <Cell {...h} />
            <TableRowColumn colSpan="2">= Hit</TableRowColumn>
            <Cell {...s} />
            <TableRowColumn colSpan="3">= Stand</TableRowColumn>
            <Cell {...p} />
            <TableRowColumn colSpan="3">= Split</TableRowColumn>
          </TableRow>
          <TableRow>
            <Cell {...d} />
            <TableRowColumn colSpan="10">
              = Double (Hit if not allowed)
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <Cell {...ds} />
            <TableRowColumn colSpan="10">
              = Double (Stand if not allowed)
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
