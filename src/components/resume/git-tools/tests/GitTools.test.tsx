import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../redux-test-render';
import GitTools, { validTypingId, getSelectOptions, getBranchName } from '../GitTools';

describe('resume | git-tools | GitTools', () => {
  test('validTypingId', () => {
    const [value1] = validTypingId.exec('KEN-1234') || [''];
    expect(value1).toStrictEqual('KEN-1234');
    const [value2] = validTypingId.exec('1234') || [''];
    expect(value2).toStrictEqual('');
  });

  test('getSelectOptions', () => {
    const selectOptions = getSelectOptions(['feat', 'test']);
    // @ts-expect-error: we know this will be an array length 2
    expect(selectOptions.length).toStrictEqual(2);
  });

  describe('getBranchName', () => {
    // prefix/<story_id>_name_lower_cased
    it('handles if branchPrefix is provided or not', () => {
      // @ts-expect-error: passing in empty prefix for test condition
      const branchName1 = getBranchName('msg', '', 'No Changes', 'KEN-1234');
      expect(branchName1).toStrictEqual('KEN-1234msg');
      const branchName2 = getBranchName('msg', 'features', 'No Changes', 'KEN-1234');
      expect(branchName2).toStrictEqual('features/KEN-1234msg');
    });

    describe('Case Preferences', () => {
      test('snake_case', () => {
        const branchName = getBranchName('branch msg', 'features', 'snake_case', 'KEN-1234');
        expect(branchName).toStrictEqual('features/KEN-1234_branch_msg');
      });
      test('kebab-case', () => {
        const branchName = getBranchName('branch msg', 'features', 'kebab-case', 'KEN-1234');
        expect(branchName).toStrictEqual('features/KEN-1234-branch-msg');
      });
      test('camelCase', () => {
        const branchName = getBranchName('branch msg', 'features', 'camelCase', 'KEN-1234');
        expect(branchName).toStrictEqual('features/KEN-1234branchMsg');
      });
      test('No Changes', () => {
        const branchName = getBranchName('branch msg', 'features', 'No Changes', 'KEN-1234');
        expect(branchName).toStrictEqual('features/KEN-1234branch msg');
      });
    });
  });

  it('renders as expected', () => {
    render(<GitTools />);

    // Git Tools
    expect(screen.getByText('Git Tools')).toBeInTheDocument();
    expect(screen.getByText('User Story ID')).toBeInTheDocument();
    expect(screen.getByText('User Story ID')).toHaveStyle('color: rgb(244, 81, 30);');

    // Create Branch Name
    expect(screen.getByText('Create Branch Name')).toBeInTheDocument();
    expect(screen.getByText('Branch Prefix')).toBeInTheDocument();
    expect(screen.getByText('features')).toBeInTheDocument();
    expect(screen.getByText('Case Preference')).toBeInTheDocument();
    expect(screen.getByText('snake_case')).toBeInTheDocument();
    expect(screen.getByText('Branch Name')).toBeInTheDocument();
    expect(screen.getByText('features/')).toBeInTheDocument();

    // Create Commit Message
    expect(screen.getByText('Create Commit Message')).toBeInTheDocument();
    expect(screen.getByText('Commit Prefix')).toBeInTheDocument();
    expect(screen.getByText('feat')).toBeInTheDocument();
    expect(screen.getByText('Finishes User Story')).toBeInTheDocument();
    expect(screen.getByText('Add git commit -m')).toBeInTheDocument();
    expect(screen.getByText('Commit Message')).toBeInTheDocument();
    expect(screen.getByText('Commit Description')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();

    // Deploy to Test Pipelines
    expect(screen.getByText('Deploy to Test Pipelines')).toBeInTheDocument();
    expect(screen.getByText('Target Branch')).toBeInTheDocument();
    expect(screen.getByText('test-pipeline')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/:test-pipeline')).toBeInTheDocument();
  });

  it('handles id changes with a valid id', () => {
    render(<GitTools />);

    fireEvent.change(screen.getByText('User Story ID').nextSibling!.lastChild!, { target: { value: 'KEN-1234' }});
    expect(screen.getByDisplayValue('KEN-1234')).toBeInTheDocument();
    expect(screen.getByText('features/KEN-1234_')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: [KEN-1234]"')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/KEN-1234_:test-pipeline')).toBeInTheDocument();
  });

  it('handles id changes with an invalid id', () => {
    render(<GitTools />);

    fireEvent.change(screen.getByText('User Story ID').nextSibling!.lastChild!, { target: { value: '1234' }});
    expect(screen.queryByDisplayValue('1234')).toBeNull();
    expect(screen.getByText('features/')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/:test-pipeline')).toBeInTheDocument();
  });

  it('handles BranchMessageChange when Branch Name is changed', () => {
    render(<GitTools />);

    fireEvent.change(screen.getByText('Branch Name').nextSibling!.firstChild!, { target: { value: 'branchMessage' }});
    expect(screen.getByDisplayValue('branchMessage')).toBeInTheDocument();
    expect(screen.getByText('features/branch_message')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/branch_message:test-pipeline')).toBeInTheDocument();
  });

  it('calls onBranchMessageClear when Branch Name clear button is pressed', () => {
    render(<GitTools />);

    fireEvent.change(screen.getByText('Branch Name').nextSibling!.firstChild!, { target: { value: 'branchMessage' }});
    expect(screen.getByDisplayValue('branchMessage')).toBeInTheDocument();
    expect(screen.getByText('features/branch_message')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/branch_message:test-pipeline')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button')[2]);
    expect(screen.queryByDisplayValue('branchMessage')).toBeNull();
    expect(screen.getByText('features/')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/:test-pipeline')).toBeInTheDocument();
  });

  it('calls setBranchPrefix on select of Branch Prefix option', () => {
    render(<GitTools />);

    expect(screen.getByText('features/')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/:test-pipeline')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('features'), { target: { value: 'fixes' }});
    expect(screen.getByText('fixes/')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin fixes/:test-pipeline')).toBeInTheDocument();
  });

  it('calls setCasePreference on select of case option', () => {
    render(<GitTools />);

    expect(screen.getByText('features/')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/:test-pipeline')).toBeInTheDocument();

    fireEvent.change(screen.getByText('Branch Name').nextSibling!.firstChild!, { target: { value: 'branchMessage' }});
    expect(screen.getByDisplayValue('branchMessage')).toBeInTheDocument();
    expect(screen.getByText('features/branch_message')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/branch_message:test-pipeline')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('snake_case'), { target: { value: 'kebab-case' }});
    expect(screen.getByText('features/branch-message')).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(screen.getByText('git push -f origin features/branch-message:test-pipeline')).toBeInTheDocument();
  });
});
