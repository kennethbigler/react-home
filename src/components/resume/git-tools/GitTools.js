// react
import React, { Component } from 'react';
// Components
import { BranchName } from './BranchName';
import { CommitText } from './CommitText';
import { Header } from './Header';
// material-ui
import MenuItem from 'material-ui/MenuItem';
// functions
import copy from 'copy-to-clipboard';
// Parents: Main

export class GitTools extends Component {
  state = { storyID: '', casePreference: 1 };

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  getSelectOptions = arr =>
    arr.map((t, i) => <MenuItem key={i} value={t} primaryText={t} />);

  /**
   * function to update text state based on value
   * @param {Object} e event fired when typing occurs
   */
  handleIDChange = e => this.setState({ storyID: e.target.value });

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   * @param {number} i index of select option
   * @param {number} v value of select option
   */
  handleCasePrefChange = (e, i, v) => this.setState({ casePreference: v });

  /**
   * function to update text state based on value
   * @param {string} str string to copy
   */
  handleCopy = str => {
    copy(str);
  };

  render() {
    const { storyID, casePreference } = this.state;
    const {
      handleIDChange,
      handleCasePrefChange,
      handleCopy,
      getSelectOptions
    } = this;

    return (
      <div>
        <Header
          {...{ storyID, casePreference, handleIDChange, handleCasePrefChange }}
        />
        <hr />
        <BranchName
          {...{ storyID, casePreference, handleCopy, getSelectOptions }}
        />
        <hr />
        <CommitText {...{ storyID, handleCopy, getSelectOptions }} />
      </div>
    );
  }
}
