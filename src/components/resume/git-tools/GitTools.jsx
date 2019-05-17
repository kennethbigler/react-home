// react
import React, { Component } from 'react';
import types from 'prop-types';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// material-ui
import MenuItem from '@material-ui/core/MenuItem';
import deepOrange from '@material-ui/core/colors/deepOrange';
// functions
import copy from 'copy-to-clipboard';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import replace from 'lodash/replace';
import {
  setBranchMessage,
  setBranchPrefix,
  setCasePreference,
  setKey,
} from '../../../store/modules/git';
// Components
import BranchName from './BranchName';
import CommitText from './CommitText';
import DeployBranch from './DeployBranch';
import Header from './Header';
import ExpandableCard from '../../common/ExpandableCard';
// Parents: Main

const validTypingId = RegExp('[A-Z]{1,4}-?[a-zA-Z0-9]*');

class GitTools extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    git: types.shape({
      storyID: types.string.isRequired,
      branchPrefix: types.string.isRequired,
      casePreference: types.string.isRequired,
    }).isRequired,
    gitActions: types.shape({
      setBranchMessage: types.func.isRequired,
      setBranchPrefix: types.func.isRequired,
      setCasePreference: types.func.isRequired,
      setKey: types.func.isRequired,
    }).isRequired,
  };

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  getSelectOptions = arr => map(arr, (t, i) => (
    <MenuItem key={i} value={t}>
      {t}
    </MenuItem>
  ));

  /**
   * function to update text state based on value
   * @param {Object} e event fired when typing occurs
   */
  handleIDChange = (e) => {
    const { gitActions } = this.props;
    const [value] = validTypingId.exec(e.target.value) || [''];
    gitActions.setKey(value);
  };

  /**
   * function to update text state based on value
   * @param {string} str string to copy
   */
  handleCopy = (str) => {
    copy(str);
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchMessageChange = (e) => {
    const { gitActions } = this.props;
    gitActions.setBranchMessage(e.target.value);
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchMessageClear = () => {
    const { gitActions } = this.props;
    gitActions.setBranchMessage('');
  };

  /**
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const {
      git: {
        branchMessage, branchPrefix, casePreference, storyID: id,
      },
    } = this.props;
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

  render() {
    const {
      git: {
        branchMessage, branchPrefix, casePreference, storyID,
      }, gitActions,
    } = this.props;
    const branchName = this.getBranchName();
    const gitTheme = deepOrange[600];

    return (
      <div>
        <Header
          {...{
            gitTheme,
            handleIDChange: this.handleIDChange,
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
              getSelectOptions: this.getSelectOptions,
              gitTheme,
              handleCopy: this.handleCopy,
              onBranchMessageChange: this.handleBranchMessageChange,
              onBranchMessageClear: this.handleBranchMessageClear,
              setBranchPrefix: gitActions.setBranchPrefix,
              setCasePreference: gitActions.setCasePreference,
            }}
          />
        </ExpandableCard>
        <ExpandableCard backgroundColor={gitTheme} title="Create Commit Message">
          <CommitText
            {...{
              getSelectOptions: this.getSelectOptions,
              gitTheme,
              handleCopy: this.handleCopy,
              storyID,
            }}
          />
        </ExpandableCard>
        <ExpandableCard backgroundColor={gitTheme} title="Deploy to Test Pipelines">
          <DeployBranch
            {...{
              branchName,
              getSelectOptions: this.getSelectOptions,
              gitTheme,
              handleCopy: this.handleCopy,
            }}
          />
        </ExpandableCard>
      </div>
    );
  }
}

// react-redux export
const mapStateToProps = state => ({ git: state.git });
const mapDispatchToProps = dispatch => ({
  gitActions: bindActionCreators(
    {
      setBranchMessage,
      setBranchPrefix,
      setCasePreference,
      setKey,
    },
    dispatch,
  ),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GitTools);
