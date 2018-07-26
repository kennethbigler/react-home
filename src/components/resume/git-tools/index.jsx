// react
import React, { Component } from 'react';
import types from 'prop-types';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MenuItem from '@material-ui/core/MenuItem';
import deepOrange from '@material-ui/core/colors/deepOrange';
import copy from 'copy-to-clipboard';
import map from 'lodash/map';
import {
  setKey,
  setBranchPrefix,
  setCasePreference,
} from '../../../store/modules/git';
// Components
import BranchName from './BranchName';
import CommitText from './CommitText';
import Header from './Header';
// material-ui
// functions
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

  render() {
    const { git, gitActions } = this.props;
    const { storyID, branchPrefix, casePreference } = git;
    const { handleIDChange, handleCopy, getSelectOptions } = this;

    return (
      <div>
        <Header {...{ gitTheme: deepOrange[600], handleIDChange, storyID }} />
        <BranchName
          {...{
            branchPrefix,
            casePreference,
            getSelectOptions,
            gitTheme: deepOrange[600],
            handleCopy,
            setBranchPrefix: gitActions.setBranchPrefix,
            setCasePreference: gitActions.setCasePreference,
            storyID,
          }}
        />
        <CommitText
          {...{
            getSelectOptions,
            gitTheme: deepOrange[600],
            handleCopy,
            storyID,
          }}
        />
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
