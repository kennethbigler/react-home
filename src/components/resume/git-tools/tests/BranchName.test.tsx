import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { render, screen, fireEvent } from '@testing-library/react';
import BranchName from '../BranchName';

describe('resume | git-tools | BranchName', () => {
  const getSelectOptions = jest.fn()
    .mockReturnValue([
      <MenuItem key="1" value="one">one</MenuItem>,
      <MenuItem key="2" value="two">two</MenuItem>,
    ]);
  const handleCopy = jest.fn();
  const onBranchMessageChange = jest.fn();
  const onBranchMessageClear = jest.fn();
  const setBranchPrefix = jest.fn();
  const setCasePreference = jest.fn();

  beforeEach(() => {
    render(
      <BranchName
        branchMessage="branchMessage"
        branchName="branchName"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error: disabled for testing purposes
        branchPrefix="one"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error: disabled for testing purposes
        casePreference="one"
        gitTheme="orange"
        getSelectOptions={getSelectOptions}
        handleCopy={handleCopy}
        onBranchMessageChange={onBranchMessageChange}
        onBranchMessageClear={onBranchMessageClear}
        setBranchPrefix={setBranchPrefix}
        setCasePreference={setCasePreference}
      />,
    );
  });

  it('renders as expected', () => {
    expect(screen.getByText('Branch Prefix')).toBeInTheDocument();
    expect(screen.getByText('Case Preference')).toBeInTheDocument();
    expect(screen.getByText('Branch Name')).toBeInTheDocument();
    expect(screen.getByText('branchName')).toBeInTheDocument();
    expect(screen.getByText('branchMessage')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('one')).toHaveLength(2);
    expect(screen.getAllByRole('button')).toHaveLength(4);

    expect(getSelectOptions).toHaveBeenCalledTimes(2);
    expect(getSelectOptions).toHaveBeenCalledWith(['chores', 'epics', 'features', 'fixes']);
    expect(getSelectOptions).toHaveBeenLastCalledWith(['snake_case', 'kebab-case', 'camelCase', 'No Changes']);
  });

  it('calls onBranchMessageChange when Branch Name is changed', () => {
    expect(onBranchMessageChange).toHaveBeenCalledTimes(0);
    fireEvent.change(screen.getByText('branchMessage'), { target: { value: 'test' }});
    expect(onBranchMessageChange).toHaveBeenCalledTimes(1);
  });

  it('calls onBranchMessageClear when Branch Name clear button is pressed', () => {
    expect(onBranchMessageClear).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getAllByRole('button')[2]);
    expect(onBranchMessageClear).toHaveBeenCalledTimes(1);
  });

  it('calls handleCopy on click of BranchName', () => {
    expect(handleCopy).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole('button')[3]);
    expect(handleCopy).toHaveBeenCalledWith('branchName');
  });
});
