// react
import React, {Component} from 'react';
import types from 'prop-types';
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setCommitPrefix} from '../../../store/modules/git';
// components
import {CopyTextDisplay} from './CopyTextDisplay';
import {ExpandableCard} from '../../common/ExpandableCard';
// material-ui
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
// functions
import nl2br from 'react-newline-to-break';
// Parents: Main

export class CT extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    getSelectOptions: types.func.isRequired,
    gitActions: types.shape({
      setCommitPrefix: types.func.isRequired,
    }).isRequired,
    gitCommit: types.bool.isRequired,
    gitTheme: types.string.isRequired,
    handleCopy: types.func.isRequired,
    storyID: types.string,
  };

  state = {
    commitPrefix: 'feat',
    commitMessage: '',
    commitDescription: '',
    finishes: false,
  };

  styles = {
    wrapper: {paddingLeft: 20, paddingRight: 20, width: '100%'},
    marginTop: {marginTop: 12},
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
      'test',
    ]);

  /**
   * function to update select state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCommitPrefixSelect = (e) => {
    this.setState({commitPrefix: e.target.value});
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCommitMessageChange = (e) => {
    this.setState({commitMessage: e.target.value});
  };
  handleCommitDescriptionChange = (e) => {
    this.setState({commitDescription: e.target.value});
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  clearCommitMessage = () => {
    this.setState({commitMessage: ''});
  };
  clearCommitDescription = () => {
    this.setState({commitDescription: ''});
  };

  /**
   * function(event: object, isInputChecked: bool) => void
   * @param {Object} e - event: Change event targeting the toggle
   * @param {boolean} isC - is input checked: The new value of the toggle
   */
  handleFinishesToggle = (e, isC) => {
    this.setState({finishes: isC});
  };
  handleGitCommitToggle = (e, isC) => {
    this.props.gitActions.setCommitPrefix(isC);
  };

  /**
   * function to generate the commit message from inputs
   * @return {string} format Prefix: Message [?Finishes? ID]
   */
  getCommitText = () => {
    const {storyID, gitCommit} = this.props;
    const {
      commitPrefix,
      commitMessage,
      commitDescription,
      finishes,
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
      finishes,
    } = this.state;
    const {handleCopy, gitCommit, gitTheme} = this.props;
    const {wrapper, marginTop} = this.styles;

    const commitText = this.getCommitText();
    const displayText = commitText && nl2br(this.getCommitText());

    return (
      <ExpandableCard backgroundColor={gitTheme} title="Create Commit Message">
        <div className="commit-text" style={wrapper}>
          <div className="row">
            <div className="col-sm-4">
              <FormControl fullWidth>
                <InputLabel htmlFor="commit-prefix">Commit Prefix</InputLabel>
                <Select
                  input={<Input id="branch-prefix" />}
                  onChange={this.handleCommitPrefixSelect}
                  value={commitPrefix}
                >
                  {this.getCommitPrefixOptions()}
                </Select>
              </FormControl>
            </div>
            <div className="col-sm-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={finishes}
                    onChange={this.handleFinishesToggle}
                    value="Finishes User Story"
                  />
                }
                label="Finishes User Story"
              />
            </div>
            <div className="col-sm-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={gitCommit}
                    onChange={this.handleGitCommitToggle}
                    value="Add git commit -m"
                  />
                }
                label="Add git commit -m"
              />
            </div>
            <div className="col-sm-5 col-10">
              <TextField
                fullWidth
                label="Commit Message"
                onChange={this.handleCommitMessageChange}
                placeholder="Summary of Work Done (Message)"
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
                fullWidth
                label="Commit Description"
                multiline
                onChange={this.handleCommitDescriptionChange}
                placeholder="Summary of Work Done (Description)"
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
const mapStateToProps = (state) => ({gitCommit: state.git.commitPrefix});
const mapDispatchToProps = (dispatch) => ({
  gitActions: bindActionCreators({setCommitPrefix}, dispatch),
});
export const CommitText = connect(mapStateToProps, mapDispatchToProps)(CT);
