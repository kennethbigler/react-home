import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import CopyTextDisplay from './CopyTextDisplay';
import { BranchPrefixes, CasePreferences } from '../../../store/types';

interface BranchNameProps {
  branchMessage?: string;
  branchName: string;
  branchPrefix: BranchPrefixes;
  casePreference: CasePreferences;
  getSelectOptions: (arr: string[]) => React.ReactNode;
  gitTheme: string;
  handleCopy: (text: string) => boolean;
  onBranchMessageChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBranchMessageClear: React.MouseEventHandler;
  setBranchPrefix: (newBranchPrefix: BranchPrefixes) => void;
  setCasePreference: (newCasePreference: CasePreferences) => void;
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
    (e: SelectChangeEvent): void => {
      setBranchPrefix(e.target.value as BranchPrefixes);
    },
    [setBranchPrefix],
  );

  /** function to update text state based on value */
  const handleCasePrefSelect = React.useCallback(
    (e: SelectChangeEvent): void => {
      setCasePreference(e.target.value as CasePreferences);
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
      <Grid container spacing={2} style={{ marginBottom: 16 }}>
        <Grid item sm={3} xs={12} style={{ marginTop: 16 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="branch-prefix" style={gitThemeStyles}>
              Branch Prefix
            </InputLabel>
            <Select
              input={<Input id="branch-prefix" />}
              onChange={handleBranchPrefixSelect}
              value={branchPrefix}
            >
              {getBranchPrefixOptions() || (
                <MenuItem value="features">features</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12} style={{ marginTop: 16 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="branch-prefix" style={gitThemeStyles}>
              Case Preference
            </InputLabel>
            <Select
              input={<Input id="branch-prefix" />}
              onChange={handleCasePrefSelect}
              value={casePreference}
            >
              {getCasePreferenceOptions() || (
                <MenuItem value="snake_case">snake_case</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={5} xs={10} style={{ marginTop: 16 }}>
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
        <Grid item sm={1} xs={2} style={{ marginTop: 16 }}>
          <IconButton onClick={onBranchMessageClear} style={topSpacing} size="large">
            <Clear />
          </IconButton>
        </Grid>
      </Grid>
      <CopyTextDisplay handleCopy={handleCopy} text={branchName} />
    </div>
  );
};

export default BranchName;
