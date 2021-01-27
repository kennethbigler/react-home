import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../redux-test-render';
import PlayerMenu from '../PlayerMenu';

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
    const BotSwitch = screen.getByTitle('isBot-switch-0').querySelector('.MuiSwitch-input');

    // verify it renders properly
    expect(BotSwitch).toBeInTheDocument();
    expect(BotSwitch?.attributes?.getNamedItem('value')?.value).toEqual('false');

    // click the expected element
    fireEvent.click(BotSwitch || screen.getByTitle('isBot-switch-0'));

    // confirm switch was toggled
    expect(BotSwitch?.attributes?.getNamedItem('value')?.value).toEqual('true');
  });

  it('performs name update onKeyPress', () => {
    render(<PlayerMenu />);

    // verify it renders properly
    expect(screen.getByDisplayValue('Ken')).toBeInTheDocument();

    // click the expected element
    fireEvent.click(screen.getByDisplayValue('Ken'));
    fireEvent.change(screen.getByDisplayValue('Ken'), { target: { value: 'Kenny' }});
    fireEvent.keyPress(screen.getByDisplayValue('Kenny'), {
      key: 'Enter',
      location: 0,
      which: 13,
      code: 'Enter',
    });
    fireEvent.keyDown(screen.getByDisplayValue('Kenny'), {
      key: 'Enter',
      location: 0,
      which: 13,
      code: 'Enter',
    });
    fireEvent.keyUp(screen.getByDisplayValue('Kenny'), {
      key: 'Enter',
      location: 0,
      which: 13,
      code: 'Enter',
    });
    fireEvent.blur(screen.getByDisplayValue('Kenny'));
    fireEvent.click(screen.getByText('Edit Player Names'));

    expect(screen.getByDisplayValue('Kenny')).toBeInTheDocument();
  });
});
