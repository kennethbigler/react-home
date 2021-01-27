import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../redux-test-render';
import DeployBranch from '../DeployBranch';

describe('resume | git-tools | DeployBranch', () => {
  let handleSelectOptions;
  const handleCopy = jest.fn();

  beforeEach(() => {
    handleSelectOptions = jest.fn().mockReturnValue([
      <MenuItem key="1" value="test-pipeline">test-pipeline</MenuItem>,
      <MenuItem key="2" value="sandbox-pipeline">sandbox-pipeline</MenuItem>,
    ]);

    render(
      <DeployBranch
        getSelectOptions={handleSelectOptions}
        gitTheme="red"
        handleCopy={handleCopy}
        branchName="features/a-new-one"
      />,
    );
  });

  it('renders as expected', () => {
    expect(screen.getByText('Target Branch')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-pipeline')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('git push -f origin features/a-new-one:test-pipeline')).toBeInTheDocument();
  });

  it('has expected color', () => {
    expect(screen.getByText('Target Branch')).toHaveStyle('color: red;');
  });

  it('copies command to clipboard when clicked', () => {
    const copyPill = screen.getByText('git push -f origin features/a-new-one:test-pipeline');
    expect(copyPill).toBeInTheDocument();
    fireEvent.click(copyPill);
    expect(handleCopy).toHaveBeenCalledWith('git push -f origin features/a-new-one:test-pipeline');
    expect(screen.getByText('Copied Commit Text to clipboard!')).toBeInTheDocument();
  });

  it('swaps test-pipeline and sandbox-pipeline on select', () => {
    expect(screen.getByText('git push -f origin features/a-new-one:test-pipeline')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-pipeline')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('sandbox-pipeline')).toBeNull();

    fireEvent.change(screen.getByDisplayValue('test-pipeline'), { target: { value: 'sandbox-pipeline' }});

    expect(screen.queryByDisplayValue('test-pipeline')).toBeNull();
    expect(screen.getByDisplayValue('sandbox-pipeline')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/a-new-one:sandbox-pipeline')).toBeInTheDocument();
  });
});
