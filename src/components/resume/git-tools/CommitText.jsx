import React, { useState } from 'react';
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

const styles = {
  wrapper: { paddingLeft: 20, paddingRight: 20, width: '100%' },
  marginTop: { marginTop: 12 },
};

function useCommitText(storyID, gitCommit) {
  const [commitPrefix, setLocalCommitPrefix] = useState('feat');
  const [commitMessage, setCommitMessage] = useState('');
  const [commitDescription, setCommitDescription] = useState('');
  const [finishes, setFinishes] = useState(false);

  /**
   * function to generate the commit message from inputs
   * @return {string} format Prefix: Message [?Finishes? ID]
   */
  const getCommitText = () => {
    const prefix = commitPrefix ? `${commitPrefix}: ` : '';
    let desc = ' ';
    if (commitDescription && storyID) {
      desc = `\n\n${commitDescription}\n\n`;
    } else if (commitDescription) {
      desc = `\n\n${commitDescription}`;
    }

    let postfix = '';
    if (finishes && storyID) {
      postfix = `[Resolves ${storyID} #finished]`;
    } else if (storyID) {
      postfix = `[${storyID}]`;
    }

    const gitMessage = `${prefix}${commitMessage}${desc}${postfix}`;

    return gitCommit ? `git commit -m "${gitMessage}"` : gitMessage;
  };

  /**
   * function to update select state based on value
   * @param {Object} e event fired when select occurs
   */
  const handleCommitPrefixSelect = (e) => {
    setLocalCommitPrefix(e.target.value);
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  const handleCommitMessageChange = (e) => {
    setCommitMessage(e.target.value);
  };

  const handleCommitDescriptionChange = (e) => {
    setCommitDescription(e.target.value);
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  const clearCommitMessage = () => {
    setCommitMessage('');
  };

  const clearCommitDescription = () => {
    setCommitDescription('');
  };

  /**
   * function(event: object, isInputChecked: bool) => void
   * @param {Object} e - event: Change event targeting the toggle
   * @param {boolean} isC - is input checked: The new value of the toggle
   */
  const handleFinishesToggle = (e, isC) => {
    setFinishes(isC);
  };

  return {
    commitPrefix,
    commitMessage,
    commitDescription,
    finishes,
    getCommitText,
    handleCommitPrefixSelect,
    handleCommitMessageChange,
    handleCommitDescriptionChange,
    clearCommitMessage,
    clearCommitDescription,
    handleFinishesToggle,
  };
}

const CommitText = (props) => {
  const {
    getSelectOptions, storyID, gitActions, handleCopy, gitCommit, gitTheme,
  } = props;

  const {
    commitPrefix,
    commitMessage,
    commitDescription,
    finishes,
    getCommitText,
    handleCommitPrefixSelect,
    handleCommitMessageChange,
    handleCommitDescriptionChange,
    clearCommitMessage,
    clearCommitDescription,
    handleFinishesToggle,
  } = useCommitText(storyID, gitCommit);

  const { wrapper, marginTop } = styles;

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  const getCommitPrefixOptions = () => getSelectOptions([
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

  const handleGitCommitToggle = (e, isC) => {
    gitActions.setCommitPrefix(isC);
  };

  const commitText = getCommitText();
  const displayText = commitText && nl2br(getCommitText());

  return (
    <div style={wrapper}>
      <Grid container spacing={1}>
        <Grid item sm={4} xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="commit-prefix" style={{ color: gitTheme }}>
              Commit Prefix
            </InputLabel>
            <Select
              input={<Input id="branch-prefix" />}
              onChange={handleCommitPrefixSelect}
              value={commitPrefix}
            >
              {getCommitPrefixOptions()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4} xs={12}>
          <FormControlLabel
            control={(
              <Switch
                checked={finishes}
                onChange={handleFinishesToggle}
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
                onChange={handleGitCommitToggle}
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
            onChange={handleCommitMessageChange}
            placeholder="Summary of Work Done (Message)"
            value={commitMessage}
          />
        </Grid>
        <Grid item sm={1} xs={2}>
          <IconButton onClick={clearCommitMessage} style={marginTop}>
            <Clear />
          </IconButton>
        </Grid>
        <Grid item sm={5} xs={10}>
          <TextField
            fullWidth
            InputLabelProps={{ style: { color: gitTheme } }}
            label="Commit Description"
            multiline
            onChange={handleCommitDescriptionChange}
            placeholder="Summary of Work Done (Description)"
            value={commitDescription}
          />
        </Grid>
        <Grid item sm={1} xs={2}>
          <IconButton
            onClick={clearCommitDescription}
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
};

CommitText.propTypes = {
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

// react-redux export
const mapStateToProps = state => ({ gitCommit: state.git.commitPrefix });
const mapDispatchToProps = dispatch => ({
  gitActions: bindActionCreators({ setCommitPrefix }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommitText);
