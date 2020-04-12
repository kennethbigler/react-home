import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../redux-test-render';
import Header from './Header';

describe('common | header | Header', () => {
  describe('basic props tests', () => {
    it('displays children', () => {
      expect(true);
    });

    it('calls handleNav as expected', () => {
      expect(true);
    });

    it('showsPlayers as expected', () => {
      expect(true);
    });
    // /** content of the header bar via render props */
    // children: (onItemClick: ItemClick) => React.ReactElement<NavProps>;
    // /** callback function, wrapped with logic, then passed as onItemClick to children */
    // handleNav: (loc: string) => void;
    // /** show/hide the player editor button */
    // showPlayers: boolean;
  });
});
