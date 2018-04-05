// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { CopyTextDisplay } from './CopyTextDisplay';
// material-ui
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
// functions
import nl2br from 'react-newline-to-break';
// Parents: Main

export class CommitText extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    storyID: PropTypes.string,
    getSelectOptions: PropTypes.func.isRequired,
    handleCopy: PropTypes.func.isRequired
  };

  state = {
    commitPrefix: 'feat',
    commitMessage: '',
    commitDescription: '',
    finishes: false
  };

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  getCommitPrefixOptions = () =>
    this.props.getSelectOptions([
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
  handleCommitPrefixSelect = (e, i, val) =>
    this.setState({ commitPrefix: val });

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCommitMessageChange = e =>
    this.setState({ commitMessage: e.target.value });
  handleCommitDescriptionChange = e =>
    this.setState({ commitDescription: e.target.value });

  /**
   * function(event: object, isInputChecked: bool) => void
   * @param {Object} event: Change event targeting the toggle
   * @param {boolean} isInputChecked: The new value of the toggle
   */
  handleFinishesToggle = (e, isC) => this.setState({ finishes: isC });

  /**
   * function to generate the commit message from inputs
   * @return {string} format Prefix: Message [?Finishes? ID]
   */
  getCommitText = () => {
    const { storyID } = this.props;
    const {
      commitPrefix,
      commitMessage,
      commitDescription,
      finishes
    } = this.state;
    const prefix = commitPrefix ? `${commitPrefix}: ` : '';
    const f = finishes ? 'finishes ' : '';
    const postfix = storyID ? ` [${f}${storyID}]` : '';
    return commitDescription
      ? `${prefix}${commitMessage}\n\n${commitDescription}\n\n${postfix}`
      : `${prefix}${commitMessage}${postfix}`;
  };

  render() {
    const {
      commitPrefix,
      commitMessage,
      commitDescription,
      finishes
    } = this.state;

    const commitText = this.getCommitText();
    const displayText = commitText && nl2br(this.getCommitText());

    return (
      <div className="commit-text">
        <h2>Create Commit Message</h2>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <SelectField
              floatingLabelText="Commit Prefix"
              value={commitPrefix}
              onChange={this.handleCommitPrefixSelect}
            >
              {this.getCommitPrefixOptions()}
            </SelectField>
          </div>
          <div className="col-sm-6 col-xs-12">
            <Toggle
              style={{ maxWidth: 300, marginTop: 40 }}
              label="Finishes User Story"
              onToggle={this.handleFinishesToggle}
              toggled={finishes}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              hintText="Summary of Work Done (Message)"
              floatingLabelText="Commit Message"
              value={commitMessage}
              onChange={this.handleCommitMessageChange}
              multiLine
              fullWidth
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              hintText="Summary of Work Done (Description)"
              floatingLabelText="Commit Description"
              value={commitDescription}
              onChange={this.handleCommitDescriptionChange}
              multiLine
              fullWidth
            />
          </div>
        </div>
        <CopyTextDisplay
          text={displayText}
          handleCopy={this.props.handleCopy}
          copyText={commitText}
        />
      </div>
    );
  }
}
