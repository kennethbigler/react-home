import * as React from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import Clear from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import nl2br from "react-newline-to-break";
import { useRecoilState } from "recoil";
import CopyTextDisplay from "./CopyTextDisplay";
import { commitPrefixGitAtom } from "../../../recoil/git-atom";
import useCommitText from "./useCommitText";

interface CommitTextProps {
  getSelectOptions: (arr: string[]) => React.ReactNode;
  gitTheme: string;
  storyID?: string;
}

const wrapperStyles: React.CSSProperties = {
  paddingLeft: 20,
  paddingRight: 20,
  width: "100%",
};
const marginTopStyles: React.CSSProperties = { marginTop: 12 };

const CommitText: React.FC<CommitTextProps> = (props: CommitTextProps) => {
  const [hasCommitPrefix, setHasCommitPrefix] =
    useRecoilState(commitPrefixGitAtom);

  const { getSelectOptions, storyID, gitTheme } = props;

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
  } = useCommitText(storyID, hasCommitPrefix);

  /** function to generate select items based of input */
  const getCommitPrefixOptions = React.useCallback(
    (): React.ReactNode =>
      getSelectOptions([
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ]),
    [getSelectOptions]
  );

  const handleGitCommitToggle = (
    _e: React.ChangeEvent<HTMLInputElement>,
    isC: boolean
  ): void => {
    setHasCommitPrefix(isC);
  };

  const commitText = getCommitText();
  const displayText = commitText && nl2br(getCommitText());

  return (
    <div style={wrapperStyles}>
      <Grid container spacing={2} style={{ marginBottom: 16 }}>
        <Grid item sm={4} xs={12} style={{ marginTop: 16 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="commit-prefix" style={{ color: gitTheme }}>
              Commit Prefix
            </InputLabel>
            <Select
              input={<Input id="commit-prefix" />}
              onChange={handleCommitPrefixSelect}
              value={commitPrefix}
            >
              {getCommitPrefixOptions()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4} xs={12} style={{ marginTop: 16 }}>
          <FormControlLabel
            control={
              <Switch
                checked={finishes}
                onChange={handleFinishesToggle}
                value="Finishes User Story"
              />
            }
            label="Finishes User Story"
          />
        </Grid>
        <Grid item sm={4} xs={12} style={{ marginTop: 16 }}>
          <FormControlLabel
            control={
              <Switch
                checked={hasCommitPrefix}
                onChange={handleGitCommitToggle}
                value="Add git commit -m"
              />
            }
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
          <IconButton
            onClick={clearCommitMessage}
            style={marginTopStyles}
            size="large"
            aria-label="Clear Commit Message"
          >
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
            style={marginTopStyles}
            size="large"
            aria-label="Clear Commit Description"
          >
            <Clear />
          </IconButton>
        </Grid>
      </Grid>
      <CopyTextDisplay copyText={commitText} text={displayText} />
    </div>
  );
};

export default CommitText;
