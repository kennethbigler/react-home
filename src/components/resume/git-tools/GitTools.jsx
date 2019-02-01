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
  setKey,
  setBranchPrefix,
  setCasePreference,
} from '../../../store/modules/git';
// Components
import BranchName from './BranchName';
import CommitText from './CommitText';
import DeployBranch from './DeployBranch';
import Header from './Header';
import ExpandableCard from '../../common/ExpandableCard';
// Parents: Main

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
      setKey: types.func.isRequired,
      setBranchPrefix: types.func.isRequired,
      setCasePreference: types.func.isRequired,
    }).isRequired,
  };

  state = { branchMessage: '' };

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
    gitActions.setKey(e.target.value);
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
    this.setState({ branchMessage: e.target.value });
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchMessageClear = () => {
    this.setState({ branchMessage: '' });
  };

  /**
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const { git: { branchPrefix, casePreference, storyID } } = this.props;
    const { branchMessage } = this.state;
    const prefix = branchPrefix ? `${branchPrefix}/` : '';
    const id = replace(storyID, /\D/g, '');
    let msg = '';
    switch (casePreference) {
      case 'snake_case':
        msg = snakeCase(`${id && `${id}_`}${branchMessage}`);
        break;
      case 'kebab-case':
        msg = kebabCase(`${id && `${id}-`}${branchMessage}`);
        break;
      case 'camelCase':
        msg = camelCase(`${id}${branchMessage}`);
        break;
      default:
        msg = `${id}${branchMessage}`;
    }
    return `${prefix}${msg}`;
  };

  render() {
    const { branchMessage } = this.state;
    const { git: { storyID, branchPrefix, casePreference }, gitActions } = this.props;
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
    { setKey, setBranchPrefix, setCasePreference },
    dispatch,
  ),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GitTools);
