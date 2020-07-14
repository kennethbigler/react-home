import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../redux-test-render';
import CommitText from './CommitText';


describe('resume | git-tools | CommitText', () => {
  let handleSelectOptions;
  let handleCopy;
  let debug: any;

  beforeEach(() => {
    handleSelectOptions = jest.fn().mockReturnValue([
      <MenuItem key="1" value="1">1</MenuItem>,
      <MenuItem key="2" value="2">2</MenuItem>,
    ]);
    handleCopy = jest.fn();

    const { debug: wrapperDebug } = render(
      <CommitText
        getSelectOptions={handleSelectOptions}
        gitTheme="red"
        handleCopy={handleCopy}
        storyID="KEN-1234"
      />,
    );

    debug = wrapperDebug;
  });

  it('renders as expected', () => {
    expect(screen.getByText('Commit Prefix')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.getByText('Finishes User Story')).toBeInTheDocument();
    expect(screen.getByText('Add git commit -m')).toBeInTheDocument();
    expect(screen.getByText('Commit Message')).toBeInTheDocument();
    expect(screen.getByText('Commit Description')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: [KEN-1234]"')).toBeInTheDocument();
  });

  it('has expected color', () => {
    expect(screen.getByText('Commit Prefix')).toHaveStyle('color: red;');
    expect(screen.getByText('Commit Message')).toHaveStyle('color: red;');
    expect(screen.getByText('Commit Description')).toHaveStyle('color: red;');
  });

  // it('updates commit prefix', () => {
  //   debug();
  //   expect(screen.getByText('Commit Prefix')).toBeInTheDocument();

  //   fireEvent.change(
  //     screen.getByText('Commit Prefix').nextElementSibling!.querySelector('#branch-prefix')!,
  //     { target: { value: 'Kenny' }},
  //   );
  //   debug();
  // });
});
