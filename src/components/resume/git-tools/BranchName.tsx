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
import { MaterialSelectEventHandler } from './types';

interface BranchNameProps {
  branchMessage?: string;
  branchName: string;
  branchPrefix: string;
  casePreference: string;
  getSelectOptions: Function;
  gitTheme: string;
  handleCopy: Function;
  onBranchMessageChange: MaterialSelectEventHandler;
  onBranchMessageClear: React.MouseEventHandler;
  setBranchPrefix: Function;
  setCasePreference: Function;
}

const wrapperStyles: React.CSSProperties = { paddingLeft: 20, paddingRight: 20, width: '100%' };
const topSpacing: React.CSSProperties = { marginTop: 12 };

const BranchName: React.FC<BranchNameProps> = (props: BranchNameProps) => {
  const { getSelectOptions, setBranchPrefix, setCasePreference } = props;

  /** function to generate select items for branch prefixes */
  const getBranchPrefixOptions = React.useCallback(
    (): React.ReactNode => getSelectOptions(['chores', 'epics', 'features', 'fixes']),
    [getSelectOptions],
  );

  /** function to generate select items for case preference */
  const getCasePreferenceOptions = React.useCallback(
    (): React.ReactNode => getSelectOptions([
      'snake_case', 'kebab-case', 'camelCase', 'No Changes',
    ]),
    [getSelectOptions],
  );

  /** function to update select state based on value */
  const handleBranchPrefixSelect = React.useCallback(
    (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
      setBranchPrefix(e.target.value);
    },
    [setBranchPrefix],
  );

  /** function to update text state based on value */
  const handleCasePrefSelect = React.useCallback(
    (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
      setCasePreference(e.target.value);
    },
    [setCasePreference],
  );

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

  const gitThemeStyles: React.CSSProperties = React.useMemo(() => ({ color: gitTheme }), [gitTheme]);

  return (
    <div style={wrapperStyles}>
      <Grid container spacing={1}>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="branch-prefix" style={gitThemeStyles}>
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
            <InputLabel htmlFor="branch-prefix" style={gitThemeStyles}>
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
            InputLabelProps={{ style: gitThemeStyles }}
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
            style={topSpacing}
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
