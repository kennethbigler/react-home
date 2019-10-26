import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import CopyTextDisplay from './CopyTextDisplay';

interface BranchNameProps {
  branchMessage?: string;
  branchName: string;
  branchPrefix: string;
  casePreference: string;
  getSelectOptions: Function;
  gitTheme: string;
  handleCopy: Function;
  onBranchMessageChange: React.ChangeEventHandler;
  onBranchMessageClear: React.MouseEventHandler;
  setBranchPrefix: Function;
  setCasePreference: Function;
}

const BranchName: React.FC<BranchNameProps> = (props: BranchNameProps) => {
  /** function to generate select items for branch prefixes */
  const getBranchPrefixOptions = (): React.ReactNode => {
    const { getSelectOptions } = props;
    return getSelectOptions(['chores', 'epics', 'features', 'fixes']);
  };

  /** function to generate select items for case preference */
  const getCasePreferenceOptions = (): React.ReactNode => {
    const { getSelectOptions } = props;
    return getSelectOptions([
      'snake_case',
      'kebab-case',
      'camelCase',
      'No Changes',
    ]);
  };

  /** function to update select state based on value */
  const handleBranchPrefixSelect = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
    const { setBranchPrefix } = props;
    setBranchPrefix(e.target.value);
  };

  /** function to update text state based on value */
  const handleCasePrefSelect = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
    const { setCasePreference } = props;
    setCasePreference(e.target.value);
  };

  const {
    branchMessage,
    branchName,
    branchPrefix,
    casePreference,
    gitTheme,
    handleCopy,
    onBranchMessageChange,
    onBranchMessageClear,
  } = props;

  return (
    <div style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
      <Grid container spacing={1}>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="branch-prefix" style={{ color: gitTheme }}>
              Branch Prefix
            </InputLabel>
            <Select
              input={<Input id="branch-prefix" />}
              onChange={handleBranchPrefixSelect}
              value={branchPrefix}
            >
              {getBranchPrefixOptions()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="branch-prefix" style={{ color: gitTheme }}>
              Case Preference
            </InputLabel>
            <Select
              input={<Input id="branch-prefix" />}
              onChange={handleCasePrefSelect}
              value={casePreference}
            >
              {getCasePreferenceOptions()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={5} xs={10}>
          <TextField
            fullWidth
            InputLabelProps={{ style: { color: gitTheme }}}
            label="Branch Name"
            multiline
            onChange={onBranchMessageChange}
            placeholder="Summary of User Story"
            value={branchMessage}
          />
        </Grid>
        <Grid item sm={1} xs={2}>
          <IconButton
            onClick={onBranchMessageClear}
            style={{ marginTop: 12 }}
          >
            <Clear />
          </IconButton>
        </Grid>
      </Grid>
      <CopyTextDisplay handleCopy={handleCopy} text={branchName} />
    </div>
  );
};

export default BranchName;
