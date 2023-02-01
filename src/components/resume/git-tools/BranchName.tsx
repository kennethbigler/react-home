import * as React from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Clear from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { useRecoilValue, useRecoilState } from "recoil";
import gitSelector from "../../../recoil/git-selector";
import CopyTextDisplay from "./CopyTextDisplay";
import gitAtom, {
  branchPrefixes,
  BranchPrefixes,
  casePreferences,
  CasePreferences,
} from "../../../recoil/git-atom";

interface BranchNameProps {
  getSelectOptions: (arr: string[]) => React.ReactNode;
  gitTheme: string;
}

const wrapperStyles: React.CSSProperties = {
  paddingLeft: 20,
  paddingRight: 20,
  width: "100%",
};
const topSpacing: React.CSSProperties = { marginTop: 12 };

const BranchName: React.FC<BranchNameProps> = (props: BranchNameProps) => {
  const [state, setState] = useRecoilState(gitAtom);
  const branchName = useRecoilValue(gitSelector);

  const { getSelectOptions, gitTheme } = props;
  const { branchMessage, branchPrefix, casePreference } = state;

  /** function to update text state based on value */
  const handleBranchMessageChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => setState({ ...state, branchMessage: e.target.value });
  /** function to clear text state based on value */
  const handleBranchMessageClear = (): void =>
    setState({ ...state, branchMessage: "" });
  /** function to update text state based on value */
  const setBranchPrefix = (newBranchPrefix: BranchPrefixes): void =>
    setState({ ...state, branchPrefix: newBranchPrefix });
  /** function to update case pref based on value */
  const setCasePreference = (newCasePreference: CasePreferences): void =>
    setState({ ...state, casePreference: newCasePreference });

  /** function to generate select items for branch prefixes */
  const getBranchPrefixOptions = (): React.ReactNode =>
    getSelectOptions([...branchPrefixes]);

  /** function to generate select items for case preference */
  const getCasePreferenceOptions = (): React.ReactNode =>
    getSelectOptions([...casePreferences]);

  /** function to update select state based on value */
  const handleBranchPrefixSelect = (e: SelectChangeEvent): void =>
    setBranchPrefix(e.target.value as BranchPrefixes);

  /** function to update text state based on value */
  const handleCasePrefSelect = (e: SelectChangeEvent): void =>
    setCasePreference(e.target.value as CasePreferences);

  const gitThemeStyles: React.CSSProperties = React.useMemo(
    () => ({ color: gitTheme }),
    [gitTheme]
  );

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
            <InputLabel htmlFor="case-preference" style={gitThemeStyles}>
              Case Preference
            </InputLabel>
            <Select
              input={<Input id="case-preference" />}
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
            onChange={handleBranchMessageChange}
            placeholder="Summary of User Story"
            value={branchMessage}
          />
        </Grid>
        <Grid item sm={1} xs={2} style={{ marginTop: 16 }}>
          <IconButton
            onClick={handleBranchMessageClear}
            style={topSpacing}
            size="large"
            aria-label="Clear Branch Name"
          >
            <Clear />
          </IconButton>
        </Grid>
      </Grid>
      <CopyTextDisplay text={branchName} />
    </div>
  );
};

export default BranchName;
