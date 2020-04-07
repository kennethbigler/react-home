import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../redux-test-render';
import PlayerMenu from './PlayerMenu';

describe('common | header | PlayerMenu', () => {
  it('renders expected text', () => {
    render(<PlayerMenu />);
    expect(screen.getByText('Edit Player Names')).toBeInTheDocument();
    expect(screen.getByText('Is Bot?')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Enter Player Name')).toBeDefined();
    expect(screen.getByTitle('player 0 name')).toBeInTheDocument();
  });

  it('performs onToggle', () => {
    render(<PlayerMenu />);

    // verify it renders properly
    expect(screen.getByTitle('isBot-switch-0').getElementsByClassName('MuiSwitch-input')[0]).toBeInTheDocument();
    expect(
      screen.getByTitle('isBot-switch-0').querySelector('.MuiSwitch-input')
        ?.attributes?.getNamedItem('value')?.value,
    ).toEqual('false');

    // click the expected element
    fireEvent.click(
      screen.getByTitle('isBot-switch-0').querySelector('.MuiSwitch-input')
      || screen.getByTitle('isBot-switch-0'),
    );

    // confirm switch was toggled
    expect(
      screen.getByTitle('isBot-switch-0').querySelector('.MuiSwitch-input')
        ?.attributes?.getNamedItem('value')?.value,
    ).toEqual('true');
  });

  it('performs name update onKeyPress or onBlur', () => {
    const wrapper = render(<PlayerMenu />);

    // verify it renders properly
    expect(screen.getByDisplayValue('Ken')).toBeInTheDocument();

    // click the expected element
    fireEvent.click(screen.getByDisplayValue('Ken'));
    fireEvent.keyPress(screen.getByDisplayValue('Ken'), { key: 'n', code: 78 });
    wrapper.debug();
    fireEvent.keyPress(screen.getByDisplayValue('Ken'), { key: 'y', code: 89 });

    expect(screen.getByDisplayValue('Kenny')).toBeInTheDocument();
  });
});
