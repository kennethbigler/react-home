import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import render from '../../../../redux-test-render';
import Yahtzee from '../Yahtzee';

describe('games | yahtzee | Yahtzee', () => {
  it('renders as expected', () => {
    render(<Yahtzee />);

    // debug();
    expect(screen.getAllByText('Yahtzee')).toHaveLength(2);
    // button 0
    expect(screen.getByText('Score History')).toBeInTheDocument();
    expect(screen.getByText('Roll #0/3')).toBeInTheDocument();
    // button 1-5 are game dice
    expect(screen.getAllByRole('button')).toHaveLength(7);
    // button 6
    expect(screen.getByText('First Roll')).toBeInTheDocument();
    expect(screen.getByText('Total: 0')).toBeInTheDocument();
    expect(screen.getByText('Minimum Required for Bonus')).toBeInTheDocument();
    expect(screen.getByText('Aces: 1,1,1 = 3')).toBeInTheDocument();
    expect(screen.getByText('Twos: 2,2,2 = 6')).toBeInTheDocument();
    expect(screen.getByText('Threes: 3,3,3 = 9')).toBeInTheDocument();
    expect(screen.getByText('Fours: 4,4,4 = 12')).toBeInTheDocument();
    expect(screen.getByText('Fives: 5,5,5 = 15')).toBeInTheDocument();
    expect(screen.getByText('Sixes: 6,6,6 = 18')).toBeInTheDocument();
    expect(screen.getByText('Total == 63')).toBeInTheDocument();
    expect(screen.getByText('Bonus if >= 63')).toBeInTheDocument();
    expect(screen.getAllByText('Upper Half Total')).toHaveLength(2);
    expect(screen.getByText('3 of a kind')).toBeInTheDocument();
    expect(screen.getByText('4 of a kind')).toBeInTheDocument();
    expect(screen.getByText('Full House')).toBeInTheDocument();
    expect(screen.getByText('Sm. Straight (4)')).toBeInTheDocument();
    expect(screen.getByText('Lg. Straight (5)')).toBeInTheDocument();
    expect(screen.getByText('Chance')).toBeInTheDocument();
    expect(screen.getByText('Lower Half Total')).toBeInTheDocument();
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
  });

  it('saves and un-saves a dice', () => {
    const { container } = render(<Yahtzee />);

    // baseline
    expect(container.querySelectorAll('.MuiButton-outlinedPrimary')).toHaveLength(5);
    expect(container.querySelectorAll('.MuiButton-outlinedSecondary')).toHaveLength(0);

    // it doesn't save if dice aren't ready
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(container.querySelectorAll('.MuiButton-outlinedPrimary')).toHaveLength(5);
    expect(container.querySelectorAll('.MuiButton-outlinedSecondary')).toHaveLength(0);

    // roll the dice
    fireEvent.click(screen.getByText('First Roll'));
    expect(container.querySelectorAll('.MuiButton-outlinedPrimary')).toHaveLength(5);
    expect(container.querySelectorAll('.MuiButton-outlinedSecondary')).toHaveLength(0);

    // save the first button
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(container.querySelectorAll('.MuiButton-outlinedPrimary')).toHaveLength(4);
    expect(container.querySelectorAll('.MuiButton-outlinedSecondary')).toHaveLength(1);

    // un-save the first button
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(container.querySelectorAll('.MuiButton-outlinedPrimary')).toHaveLength(5);
    expect(container.querySelectorAll('.MuiButton-outlinedSecondary')).toHaveLength(0);
  });

  it('plays the game and saves to the top half scores', () => {
    render(<Yahtzee />);

    expect(screen.getAllByText('0')).toHaveLength(6);
    // do the first 3 rolls, then try to do the 4th
    fireEvent.click(screen.getByText('First Roll'));
    fireEvent.click(screen.getByText('Second Roll'));
    fireEvent.click(screen.getByText('Last Roll'));
    fireEvent.click(screen.getByText('Next Turn'));
    // the 4th click will not work
    expect(screen.getByText('Next Turn')).toBeInTheDocument();
    // so instead we pick our score
    fireEvent.click(screen.getAllByText('0')[0]);
    fireEvent.click(screen.getByText('Next Turn'));
    // now Next Turn should be gone
    expect(screen.queryByText('Next Turn')).toBeNull();
    // 1 zero should have been added to the UI
    expect(screen.getAllByText('0')).toHaveLength(12);
    // and adds to the bottom score
    fireEvent.click(screen.getByText('First Roll'));
    fireEvent.click(screen.getByText('Second Roll'));
    fireEvent.click(screen.getByText('Last Roll'));
    const buttons = screen.getAllByRole('button');
    const chanceButton = buttons[buttons.length - 1];
    fireEvent.click(chanceButton);
    // @ts-expect-error: we know this will have a value
    const submittedValue = parseInt(chanceButton.textContent[4] + chanceButton.textContent[5], 10);
    expect(screen.getByText(`${submittedValue}`)).toBeInTheDocument();
  });
});
