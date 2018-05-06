// react
import React, { Component } from 'react';
import types from 'prop-types';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setKey,
  setBranchPrefix,
  setCasePreference
} from '../../../store/modules/git';
// Components
import { BranchName } from './BranchName';
import { CommitText } from './CommitText';
import { Header } from './Header';
// material-ui
import MenuItem from 'material-ui/MenuItem';
import { deepOrange600 } from 'material-ui/styles/colors';
// functions
import copy from 'copy-to-clipboard';
import map from 'lodash/map';
// Parents: Main

class GT extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    git: types.shape({
      storyID: types.string.isRequired,
      branchPrefix: types.string.isRequired,
      casePreference: types.string.isRequired
    }).isRequired,
    gitActions: types.shape({
      setKey: types.func.isRequired,
      setBranchPrefix: types.func.isRequired,
      setCasePreference: types.func.isRequired
    }).isRequired
  };

  state = { storyID: '' };

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  getSelectOptions = arr =>
    map(arr, (t, i) => <MenuItem key={i} primaryText={t} value={t} />);

  /**
   * function to update text state based on value
   * @param {Object} e event fired when typing occurs
   */
  handleIDChange = e => {
    this.props.gitActions.setKey(e.target.value);
    //this.setState({ storyID: e.target.value });
  };

  /**
   * function to update text state based on value
   * @param {string} str string to copy
   */
  handleCopy = str => {
    copy(str);
  };

  render() {
    const { storyID, branchPrefix, casePreference } = this.props.git;
    const { setBranchPrefix, setCasePreference } = this.props.gitActions;
    const { handleIDChange, handleCopy, getSelectOptions } = this;

    return (
      <div>
        <Header {...{ gitTheme: deepOrange600, handleIDChange, storyID }} />
        <BranchName
          {...{
            branchPrefix,
            casePreference,
            getSelectOptions,
            gitTheme: deepOrange600,
            handleCopy,
            setBranchPrefix,
            setCasePreference,
            storyID
          }}
        />
        <CommitText
          {...{
            getSelectOptions,
            gitTheme: deepOrange600,
            handleCopy,
            storyID
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
    dispatch
  )
});
export const GitTools = connect(mapStateToProps, mapDispatchToProps)(GT);
