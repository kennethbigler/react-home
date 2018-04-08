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
  state = { storyID: '' };

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
   * @param {string} str string to copy
   */
  handleCopy = str => {
    copy(str);
  };

  render() {
    const { storyID } = this.state;
    const { handleIDChange, handleCopy, getSelectOptions } = this;

    return (
      <div>
        <Header {...{ storyID, handleIDChange }} />
        <hr />
        <BranchName {...{ storyID, handleCopy, getSelectOptions }} />
        <hr />
        <CommitText {...{ storyID, handleCopy, getSelectOptions }} />
      </div>
    );
  }
}
