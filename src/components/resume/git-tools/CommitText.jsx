import React, { Component } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import nl2br from 'react-newline-to-break';
import CopyTextDisplay from './CopyTextDisplay';
import { setCommitPrefix } from '../../../store/modules/git';
// Parents: Main

class CommitText extends Component {
  styles = {
    wrapper: { paddingLeft: 20, paddingRight: 20, width: '100%' },
    marginTop: { marginTop: 12 },
  };

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

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  getCommitPrefixOptions = () => {
    const { getSelectOptions } = this.props;
    return getSelectOptions([
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
  };

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

  /**
   * function to update select state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCommitPrefixSelect = (e) => {
    this.setState({ commitPrefix: e.target.value });
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCommitMessageChange = (e) => {
    this.setState({ commitMessage: e.target.value });
  };

  handleCommitDescriptionChange = (e) => {
    this.setState({ commitDescription: e.target.value });
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  clearCommitMessage = () => {
    this.setState({ commitMessage: '' });
  };

  clearCommitDescription = () => {
    this.setState({ commitDescription: '' });
  };

  /**
   * function(event: object, isInputChecked: bool) => void
   * @param {Object} e - event: Change event targeting the toggle
   * @param {boolean} isC - is input checked: The new value of the toggle
   */
  handleFinishesToggle = (e, isC) => {
    this.setState({ finishes: isC });
  };

  handleGitCommitToggle = (e, isC) => {
    const { gitActions } = this.props;
    gitActions.setCommitPrefix(isC);
  };

  render() {
    const {
      commitPrefix,
      commitMessage,
      commitDescription,
      finishes,
    } = this.state;
    const { handleCopy, gitCommit, gitTheme } = this.props;
    const { wrapper, marginTop } = this.styles;

    const commitText = this.getCommitText();
    const displayText = commitText && nl2br(this.getCommitText());

    return (
      <div style={wrapper}>
        <Grid container spacing={16}>
          <Grid item sm={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="commit-prefix" style={{ color: gitTheme }}>
                Commit Prefix
              </InputLabel>
              <Select
                input={<Input id="branch-prefix" />}
                onChange={this.handleCommitPrefixSelect}
                value={commitPrefix}
              >
                {this.getCommitPrefixOptions()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={4} xs={12}>
            <FormControlLabel
              control={(
                <Switch
                  checked={finishes}
                  onChange={this.handleFinishesToggle}
                  value="Finishes User Story"
                />
              )}
              label="Finishes User Story"
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <FormControlLabel
              control={(
                <Switch
                  checked={gitCommit}
                  onChange={this.handleGitCommitToggle}
                  value="Add git commit -m"
                />
              )}
              label="Add git commit -m"
            />
          </Grid>
          <Grid item sm={5} xs={10}>
            <TextField
              fullWidth
              InputLabelProps={{ style: { color: gitTheme } }}
              label="Commit Message"
              onChange={this.handleCommitMessageChange}
              placeholder="Summary of Work Done (Message)"
              value={commitMessage}
            />
          </Grid>
          <Grid item sm={1} xs={2}>
            <IconButton onClick={this.clearCommitMessage} style={marginTop}>
              <Clear />
            </IconButton>
          </Grid>
          <Grid item sm={5} xs={10}>
            <TextField
              fullWidth
              InputLabelProps={{ style: { color: gitTheme } }}
              label="Commit Description"
              multiline
              onChange={this.handleCommitDescriptionChange}
              placeholder="Summary of Work Done (Description)"
              value={commitDescription}
            />
          </Grid>
          <Grid item sm={1} xs={2}>
            <IconButton
              onClick={this.clearCommitDescription}
              style={marginTop}
            >
              <Clear />
            </IconButton>
          </Grid>
        </Grid>
        <CopyTextDisplay
          copyText={commitText}
          handleCopy={handleCopy}
          text={displayText}
        />
      </div>
    );
  }
}

// react-redux export
const mapStateToProps = state => ({ gitCommit: state.git.commitPrefix });
const mapDispatchToProps = dispatch => ({
  gitActions: bindActionCreators({ setCommitPrefix }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommitText);
