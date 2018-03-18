// react
import React, { Component } from 'react';
// components
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// functions
import snake from 'to-snake-case';
// Parents: Main

export class GitTools extends Component {
  state = {
    storyID: '',
    branchPrefix: '',
    commitPrefix: '',
    branchMessage: '',
    commitMessage: '',
    finishes: false
  };

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  getSelectOptions = arr =>
    arr.map((t, i) => <MenuItem key={i} value={t} primaryText={t} />);
  getBranchPrefixOptions = () =>
    this.getSelectOptions(['', 'features', 'fixes']);
  getCommitPrefixOptions = () =>
    this.getSelectOptions([
      '',
      'build',
      'chore',
      'ci',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      'test'
    ]);

  /**
   * function to update select state based on value
   * @param {Object} e event fired when select occurs
   * @param {number} i index of option selected
   * @param {number} val value of option selected
   */
  handleBranchPrefixSelect = (e, i, val) =>
    this.setState({ branchPrefix: val });
  handleCommitPrefixSelect = (e, i, val) =>
    this.setState({ commitPrefix: val });

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleIDChange = e => this.setState({ storyID: e.target.value });
  handleBranchMessageChange = e =>
    this.setState({ branchMessage: e.target.value });
  handleCommitMessageChange = e =>
    this.setState({ commitMessage: e.target.value });

  /**
   * function(event: object, isInputChecked: bool) => void
   * @param {Object} event: Change event targeting the toggle
   * @param {boolean} isInputChecked: The new value of the toggle
   */
  handleFinishesToggle = (e, isC) => this.setState({ finishes: isC });

  /**
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const { branchPrefix, storyID, branchMessage } = this.state;
    const prefix = branchPrefix ? `${branchPrefix}/` : '';
    const id = storyID.replace(/\D/g, '');
    const msg = snake(`${id} ${branchMessage}`);
    return `${prefix}${msg}`;
  };

  /**
   * function to generate the commit message from inputs
   * @return {string} format Prefix: Message [?Finishes? ID]
   */
  getCommitName = () => {
    const { commitPrefix, commitMessage, finishes, storyID } = this.state;
    const prefix = commitPrefix ? `${commitPrefix}: ` : '';
    const f = finishes ? 'finishes ' : '';
    const postfix = storyID ? ` [${f}${storyID}]` : '';
    return `${prefix}${commitMessage}${postfix}`;
  };

  render() {
    const {
      storyID,
      branchPrefix,
      commitPrefix,
      branchMessage,
      commitMessage,
      finishes
    } = this.state;

    return (
      <div>
        <TextField
          hintText="#1234567890"
          floatingLabelText="User Story ID"
          value={storyID}
          onChange={this.handleIDChange}
        />
        <br />
        <hr />
        <h2>Create Branch Name</h2>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <SelectField
              floatingLabelText="Branch Prefix"
              value={branchPrefix}
              onChange={this.handleBranchPrefixSelect}
            >
              {this.getBranchPrefixOptions()}
            </SelectField>
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              hintText="Summary of User Story"
              floatingLabelText="Branch Name"
              value={branchMessage}
              onChange={this.handleBranchMessageChange}
            />
          </div>
        </div>
        <br />
        <h3>{this.getBranchName()}</h3>
        <br />
        <hr />
        <h2>Create Commit Message</h2>
        <div className="row">
          <div className="col-md-4 col-sm-6 col-xs-12">
            <SelectField
              floatingLabelText="Commit Prefix"
              value={commitPrefix}
              onChange={this.handleCommitPrefixSelect}
            >
              {this.getCommitPrefixOptions()}
            </SelectField>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <TextField
              hintText="Summary of Work Done"
              floatingLabelText="Commit Message"
              value={commitMessage}
              onChange={this.handleCommitMessageChange}
            />
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Toggle
              style={{ maxWidth: 300, marginTop: 40 }}
              label="Finishes User Story"
              onToggle={this.handleFinishesToggle}
              toggled={finishes}
            />
          </div>
        </div>
        <br />
        <h3>{this.getCommitName()}</h3>
      </div>
    );
  }
}
