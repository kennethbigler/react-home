// react
import React, { Component } from 'react';
// Components
import { BranchName } from './BranchName';
import { CommitText } from './CommitText';
// material-ui
import TextField from 'material-ui/TextField';
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
   * @param {Object} e event fired when select occurs
   */
  handleIDChange = e => this.setState({ storyID: e.target.value });

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCopy = str => {
    copy(str);
  };

  render() {
    const { storyID } = this.state;

    return (
      <div>
        <h1>Git Tools</h1>
        <TextField
          hintText="#123456789"
          floatingLabelText="User Story ID"
          value={storyID}
          onChange={this.handleIDChange}
        />
        <br />
        <hr />
        <BranchName
          handleCopy={this.handleCopy}
          getSelectOptions={this.getSelectOptions}
          storyID={storyID}
        />
        <hr />
        <CommitText
          handleCopy={this.handleCopy}
          getSelectOptions={this.getSelectOptions}
          storyID={storyID}
        />
      </div>
    );
  }
}
