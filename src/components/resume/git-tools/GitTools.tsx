import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import MenuItem from '@material-ui/core/MenuItem';
import deepOrange from '@material-ui/core/colors/deepOrange';
import copy from 'copy-to-clipboard';
import snakeCase from 'lodash/snakeCase';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import {
  setBranchMessage, setBranchPrefix, setCasePreference, setKey,
} from '../../../store/modules/git';
import BranchName from './BranchName';
import CommitText from './CommitText';
import DeployBranch from './DeployBranch';
import Header from './Header';
import ExpandableCard from '../../common/expandable-card';
import { DBRootState, DBGit } from '../../../store/types';
import { MaterialSelectEvent } from './types';

interface GitActions {
  setBranchMessage: Function;
  setBranchPrefix: Function;
  setCasePreference: Function;
  setKey: Function;
}
interface GitToolsProps {
  git: DBGit;
  gitActions: GitActions;
}

const validTypingId = RegExp('[A-Z]{1,4}-?[a-zA-Z0-9]*');

/* GitTools  ->  Header
 *          |->  BranchName    -|
 *          |->  CommitText    -|->  CopyTextDisplay
 *          |->  DeployBranch  -|    */
const GitTools: React.FC<GitToolsProps> = (props: GitToolsProps) => {
  /** function to generate select items based of input */
  const getSelectOptions = (arr: string[]): React.ReactNode => arr.map((t, i) => (
    <MenuItem key={i} value={t}>{t}</MenuItem>
  ));

  /** function to update text state based on value */
  const handleIDChange = (e: MaterialSelectEvent): void => {
    const { gitActions } = props;
    const [value] = validTypingId.exec(e.target.value as string) || [''];
    gitActions.setKey(value);
  };

  /** function to update text state based on value */
  const handleCopy = (str: string): void => {
    copy(str);
  };

  /** function to update text state based on value */
  const handleBranchMessageChange = (e: MaterialSelectEvent): void => {
    const { gitActions } = props;
    gitActions.setBranchMessage(e.target.value as string);
  };

  /** function to update text state based on value */
  const handleBranchMessageClear = (): void => {
    const { gitActions } = props;
    gitActions.setBranchMessage('');
  };

  /** function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  const getBranchName = (): string => {
    const {
      git: {
        branchMessage, branchPrefix, casePreference, storyID: id,
      },
    } = props;
    const prefix = branchPrefix ? `${branchPrefix}/` : '';
    let msg = '';
    switch (casePreference) {
      case 'snake_case':
        msg = `${id && `${id}_`}${snakeCase(branchMessage)}`;
        break;
      case 'kebab-case':
        msg = `${id && `${id}-`}${kebabCase(branchMessage)}`;
        break;
      case 'camelCase':
        msg = `${id}${camelCase(branchMessage)}`;
        break;
      default:
        msg = `${id}${branchMessage}`;
    }
    return `${prefix}${msg}`;
  };

  const {
    git: {
      branchMessage, branchPrefix, casePreference, storyID,
    }, gitActions,
  } = props;
  const branchName = getBranchName();
  const gitTheme = deepOrange[600];

  return (
    <>
      <Header
        {...{
          gitTheme,
          handleIDChange,
          storyID,
        }}
      />
      <ExpandableCard backgroundColor={gitTheme} title="Create Branch Name">
        <BranchName
          {...{
            branchMessage,
            branchName,
            branchPrefix,
            casePreference,
            getSelectOptions,
            gitTheme,
            handleCopy,
            onBranchMessageChange: handleBranchMessageChange,
            onBranchMessageClear: handleBranchMessageClear,
            setBranchPrefix: gitActions.setBranchPrefix,
            setCasePreference: gitActions.setCasePreference,
          }}
        />
      </ExpandableCard>
      <ExpandableCard backgroundColor={gitTheme} title="Create Commit Message">
        <CommitText
          {...{
            getSelectOptions,
            gitTheme,
            handleCopy,
            storyID,
          }}
        />
      </ExpandableCard>
      <ExpandableCard backgroundColor={gitTheme} title="Deploy to Test Pipelines">
        <DeployBranch
          {...{
            branchName,
            getSelectOptions,
            gitTheme,
            handleCopy,
          }}
        />
      </ExpandableCard>
    </>
  );
};

// react-redux export
const mapStateToProps = (state: DBRootState): { git: DBGit } => ({
  git: state.git,
});
const mapDispatchToProps = (dispatch: Dispatch): { gitActions: GitActions } => ({
  gitActions: bindActionCreators(
    {
      setBranchMessage, setBranchPrefix, setCasePreference, setKey,
    },
    dispatch,
  ),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GitTools);
