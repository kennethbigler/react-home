import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { DBRootState } from '../../../store/types';
import useCommitText from './useCommitText';

interface CommitTextProps {
  getSelectOptions: (arr: string[]) => React.ReactNode;
  gitTheme: string;
  handleCopy: (text: string) => boolean;
  storyID?: string;
}

const wrapperStyles: React.CSSProperties = { paddingLeft: 20, paddingRight: 20, width: '100%' };
const marginTopStyles: React.CSSProperties = { marginTop: 12 };

const CommitText: React.FC<CommitTextProps> = (props: CommitTextProps) => {
  const gitCommit = useSelector((state: DBRootState) => state.git.commitPrefix);
  const dispatch = useDispatch();

  const {
    getSelectOptions, storyID, handleCopy, gitTheme,
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

  /** function to generate select items based of input */
  const getCommitPrefixOptions = React.useCallback((): React.ReactNode => getSelectOptions([
    'build', 'chore', 'ci', 'docs',
    'feat', 'fix', 'perf', 'refactor',
    'revert', 'style', 'test',
  ]), [getSelectOptions]);

  const handleGitCommitToggle = React.useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, isC: boolean): void => {
      dispatch(setCommitPrefix(isC));
    },
    [dispatch],
  );

  const commitText = getCommitText();
  const displayText = commitText && nl2br(getCommitText());

  return (
    <div style={wrapperStyles}>
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
            InputLabelProps={{ style: { color: gitTheme }}}
            label="Commit Message"
            onChange={handleCommitMessageChange}
            placeholder="Summary of Work Done (Message)"
            value={commitMessage}
          />
        </Grid>
        <Grid item sm={1} xs={2}>
          <IconButton onClick={clearCommitMessage} style={marginTopStyles}>
            <Clear />
          </IconButton>
        </Grid>
        <Grid item sm={5} xs={10}>
          <TextField
            fullWidth
            InputLabelProps={{ style: { color: gitTheme }}}
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
            style={marginTopStyles}
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

export default CommitText;
