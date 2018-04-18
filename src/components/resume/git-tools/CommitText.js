// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { CopyTextDisplay } from './CopyTextDisplay';
import { ExpandableCard } from '../../common/ExpandableCard';
// material-ui
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import { deepOrange600 } from 'material-ui/styles/colors';
// functions
import nl2br from 'react-newline-to-break';
// Parents: Main

export class CommitText extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    getSelectOptions: PropTypes.func.isRequired,
    gitTheme: PropTypes.string.isRequired,
    handleCopy: PropTypes.func.isRequired,
    storyID: PropTypes.string
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
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCommitMessageClear = () => this.setState({ commitMessage: '' });
  handleCommitDescriptionClear = () => this.setState({ commitDescription: '' });

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
    const postfix = storyID ? `[${f}${storyID}]` : '';
    return commitDescription
      ? `${prefix}${commitMessage}\n\n${commitDescription}\n\n${postfix}`
      : `${prefix}${commitMessage} ${postfix}`;
  };

  render() {
    const {
      commitPrefix,
      commitMessage,
      commitDescription,
      finishes
    } = this.state;
    const { gitTheme, handleCopy } = this.props;

    const commitText = this.getCommitText();
    const displayText = commitText && nl2br(this.getCommitText());

    return (
      <ExpandableCard
        title="Create Commit Message"
        backgroundColor={deepOrange600}
      >
        <div
          className="commit-text"
          style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}
        >
          <div className="row">
            <div className="col-sm-6">
              <SelectField
                floatingLabelStyle={{ color: gitTheme }}
                floatingLabelText="Commit Prefix"
                onChange={this.handleCommitPrefixSelect}
                selectedMenuItemStyle={{ color: gitTheme }}
                underlineFocusStyle={{ borderColor: gitTheme }}
                value={commitPrefix}
              >
                {this.getCommitPrefixOptions()}
              </SelectField>
            </div>
            <div className="col-sm-6">
              <Toggle
                style={{ maxWidth: 343, marginTop: 40 }}
                label="Finishes User Story"
                onToggle={this.handleFinishesToggle}
                toggled={finishes}
              />
            </div>
            <div className="col-sm-5 col-10">
              <TextField
                floatingLabelFocusStyle={{ color: gitTheme }}
                floatingLabelText="Commit Message"
                fullWidth
                hintText="Summary of Work Done (Message)"
                multiLine
                onChange={this.handleCommitMessageChange}
                underlineFocusStyle={{ borderColor: gitTheme }}
                value={commitMessage}
              />
            </div>
            <div className="col-sm-1 col-2">
              <IconButton
                onClick={this.handleCommitMessageClear}
                style={{ marginTop: 20 }}
              >
                <Clear />
              </IconButton>
            </div>
            <div className="col-sm-5 col-10">
              <TextField
                floatingLabelFocusStyle={{ color: gitTheme }}
                floatingLabelText="Commit Description"
                fullWidth
                hintText="Summary of Work Done (Description)"
                multiLine
                onChange={this.handleCommitDescriptionChange}
                underlineFocusStyle={{ borderColor: gitTheme }}
                value={commitDescription}
              />
            </div>
            <div className="col-sm-1 col-2">
              <IconButton
                onClick={this.handleCommitDescriptionClear}
                style={{ marginTop: 20 }}
              >
                <Clear />
              </IconButton>
            </div>
          </div>
          <CopyTextDisplay
            text={displayText}
            handleCopy={handleCopy}
            copyText={commitText}
          />
        </div>
      </ExpandableCard>
    );
  }
}
