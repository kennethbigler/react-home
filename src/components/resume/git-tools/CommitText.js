// react
import React, { Component } from 'react';
import types from 'prop-types';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCommitPrefix } from '../../../store/modules/git';
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

export class CT extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    getSelectOptions: types.func.isRequired,
    gitActions: types.shape({
      setCommitPrefix: types.func.isRequired
    }).isRequired,
    gitCommit: types.bool.isRequired,
    gitTheme: types.string.isRequired,
    handleCopy: types.func.isRequired,
    storyID: types.string
  };

  state = {
    commitPrefix: 'feat',
    commitMessage: '',
    commitDescription: '',
    finishes: false
  };

  styles = {
    wrapper: { paddingLeft: 20, paddingRight: 20, width: '100%' },
    toggle: { maxWidth: 343, marginTop: 40 },
    marginTop: { marginTop: 20 },
    textColor: { color: this.props.gitTheme },
    borderColor: { borderColor: this.props.gitTheme }
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
  clearCommitMessage = () => this.setState({ commitMessage: '' });
  clearCommitDescription = () => this.setState({ commitDescription: '' });

  /**
   * function(event: object, isInputChecked: bool) => void
   * @param {Object} event: Change event targeting the toggle
   * @param {boolean} isInputChecked: The new value of the toggle
   */
  handleFinishesToggle = (e, isC) => this.setState({ finishes: isC });
  handleGitCommitToggle = (e, isC) =>
    this.props.gitActions.setCommitPrefix(isC);

  /**
   * function to generate the commit message from inputs
   * @return {string} format Prefix: Message [?Finishes? ID]
   */
  getCommitText = () => {
    const { storyID, gitCommit } = this.props;
    const {
      commitPrefix,
      commitMessage,
      commitDescription,
      finishes
    } = this.state;

    let gitMessage = '';
    let quote = '';
    if (gitCommit) {
      gitMessage = 'git commit -m "';
      quote = '"';
    }

    const prefix = commitPrefix ? `${commitPrefix}: ` : '';
    const desc = commitDescription ? `\n\n${commitDescription}\n\n` : ' ';

    const f = finishes ? 'finishes ' : '';
    const postfix = storyID ? `[${f}${storyID}]` : '';

    return `${gitMessage}${prefix}${commitMessage}${desc}${postfix}${quote}`;
  };

  render() {
    const {
      commitPrefix,
      commitMessage,
      commitDescription,
      finishes
    } = this.state;
    const { handleCopy, gitCommit } = this.props;
    const { wrapper, toggle, marginTop, textColor, borderColor } = this.styles;

    const commitText = this.getCommitText();
    const displayText = commitText && nl2br(this.getCommitText());

    return (
      <ExpandableCard
        backgroundColor={deepOrange600}
        title="Create Commit Message"
      >
        <div className="commit-text" style={wrapper}>
          <div className="row">
            <div className="col-sm-4">
              <SelectField
                floatingLabelStyle={textColor}
                floatingLabelText="Commit Prefix"
                onChange={this.handleCommitPrefixSelect}
                selectedMenuItemStyle={textColor}
                underlineFocusStyle={borderColor}
                value={commitPrefix}
              >
                {this.getCommitPrefixOptions()}
              </SelectField>
            </div>
            <div className="col-sm-4">
              <Toggle
                label="Finishes User Story"
                onToggle={this.handleFinishesToggle}
                style={toggle}
                toggled={finishes}
              />
            </div>
            <div className="col-sm-4">
              <Toggle
                label="Add git commit -m"
                onToggle={this.handleGitCommitToggle}
                style={toggle}
                toggled={gitCommit}
              />
            </div>
            <div className="col-sm-5 col-10">
              <TextField
                floatingLabelFocusStyle={textColor}
                floatingLabelText="Commit Message"
                fullWidth
                hintText="Summary of Work Done (Message)"
                onChange={this.handleCommitMessageChange}
                underlineFocusStyle={borderColor}
                value={commitMessage}
              />
            </div>
            <div className="col-sm-1 col-2">
              <IconButton onClick={this.clearCommitMessage} style={marginTop}>
                <Clear />
              </IconButton>
            </div>
            <div className="col-sm-5 col-10">
              <TextField
                floatingLabelFocusStyle={textColor}
                floatingLabelText="Commit Description"
                fullWidth
                hintText="Summary of Work Done (Description)"
                multiLine
                onChange={this.handleCommitDescriptionChange}
                underlineFocusStyle={borderColor}
                value={commitDescription}
              />
            </div>
            <div className="col-sm-1 col-2">
              <IconButton
                onClick={this.clearCommitDescription}
                style={marginTop}
              >
                <Clear />
              </IconButton>
            </div>
          </div>
          <CopyTextDisplay
            copyText={commitText}
            handleCopy={handleCopy}
            text={displayText}
          />
        </div>
      </ExpandableCard>
    );
  }
}

// react-redux export
const mapStateToProps = state => ({ gitCommit: state.git.commitPrefix });
const mapDispatchToProps = dispatch => ({
  gitActions: bindActionCreators({ setCommitPrefix }, dispatch)
});
export const CommitText = connect(mapStateToProps, mapDispatchToProps)(CT);
