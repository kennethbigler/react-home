import React from 'react';
import { Cell } from './Cell';
import { HelpHead } from './HelpHead';
import { HelpBody } from './HelpBody';
// Parents: Popup

/** render code for each class */
export const Help = () => {
  // options
  const h = { type: 'table-success', action: 'H' };
  const d = { type: 'table-info', action: 'D' };
  const s = { type: 'table-danger', action: 'S' };
  const p = { type: 'table-warning', action: 'P' };
  const ds = { type: 'table-info', action: 'DS' };

  // algorithms for options
  const hardTtl = [
    { name: 'Hard 5', arr: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 6', arr: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 7', arr: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 8', arr: [h, h, h, h, h, h, h, h, h, h] },
    { name: 'Hard 9', arr: [h, d, d, d, d, h, h, h, h, h] },
    { name: 'Hard 10', arr: [d, d, d, d, d, d, d, d, h, h] },
    { name: 'Hard 11', arr: [d, d, d, d, d, d, d, d, d, d] },
    { name: 'Hard 12', arr: [h, h, s, s, s, h, h, h, h, h] },
    { name: 'Hard 13', arr: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 14', arr: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 15', arr: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 16', arr: [s, s, s, s, s, h, h, h, h, h] },
    { name: 'Hard 17', arr: [s, s, s, s, s, s, s, s, s, s] },
    { name: 'Hard 18+', arr: [s, s, s, s, s, s, s, s, s, s] }
  ];
  const softTtl = [
    { name: 'Ace + 2', arr: [h, h, h, d, d, h, h, h, h, h] },
    { name: 'Ace + 3', arr: [h, h, h, d, d, h, h, h, h, h] },
    { name: 'Ace + 4', arr: [h, h, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 5', arr: [h, h, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 6', arr: [h, d, d, d, d, h, h, h, h, h] },
    { name: 'Ace + 7', arr: [ds, ds, ds, ds, ds, s, s, h, h, h] },
    { name: 'Ace + 8', arr: [s, s, s, s, ds, s, s, s, s, s] },
    { name: 'Ace + 9', arr: [s, s, s, s, s, s, s, s, s, s] }
  ];
  const pairs = [
    { name: '(2,2)', arr: [p, p, p, p, p, p, h, h, h, h] },
    { name: '(3,3)', arr: [p, p, p, p, p, p, h, h, h, h] },
    { name: '(4,4)', arr: [h, h, h, p, p, h, h, h, h, h] },
    { name: '(5,5)', arr: [d, d, d, d, d, d, d, d, h, h] },
    { name: '(6,6)', arr: [p, p, p, p, p, h, h, h, h, h] },
    { name: '(7,7)', arr: [p, p, p, p, p, p, h, h, h, h] },
    { name: '(8,8)', arr: [p, p, p, p, p, p, p, p, p, p] },
    { name: '(9,9)', arr: [p, p, p, p, p, s, p, p, s, s] },
    { name: '(T,T)', arr: [s, s, s, s, s, s, s, s, s, s] },
    { name: '(A,A)', arr: [p, p, p, p, p, p, p, p, p, p] }
  ];

  return (
    <table className="table table-striped table-bordered table-hover">
      <HelpHead name="Hard Totals" />
      <HelpBody arr={hardTtl} />
      <HelpHead name="Soft Totals" />
      <HelpBody arr={softTtl} />
      <HelpHead name="Pairs" />
      <HelpBody arr={pairs} />
      <HelpHead name="Key" />
      <tbody>
        <tr>
          <Cell {...h} />
          <td colSpan="2">= Hit</td>
          <Cell {...s} />
          <td colSpan="3">= Stand</td>
          <Cell {...p} />
          <td colSpan="3">= Split</td>
        </tr>
        <tr>
          <Cell {...d} />
          <td colSpan="10">= Double (Hit if not allowed)</td>
        </tr>
        <tr>
          <Cell {...ds} />
          <td colSpan="10">= Double (Stand if not allowed)</td>
        </tr>
      </tbody>
    </table>
  );
};
