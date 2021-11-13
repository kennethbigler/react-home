import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Input from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import CopyTextDisplay from "./CopyTextDisplay";

interface DeployBranchProps {
  branchName: string;
  getSelectOptions: (arr: string[]) => React.ReactNode;
  gitTheme: string;
  handleCopy: (text: string) => boolean;
}

const DeployBranch: React.FC<DeployBranchProps> = React.memo(
  (props: DeployBranchProps) => {
    const [targetBranch, setTargetBranch] = React.useState("test-pipeline");

    const handleSelect = React.useCallback(
      (e: SelectChangeEvent): void => {
        setTargetBranch(e.target.value);
      },
      [setTargetBranch]
    );

    const { gitTheme, handleCopy, getSelectOptions, branchName } = props;

    return (
      <div style={{ paddingLeft: 20, paddingRight: 20, width: "100%" }}>
        <Grid
          container
          spacing={1}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Grid item sm={3} xs={12} style={{ marginTop: 16 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="target-branch" style={{ color: gitTheme }}>
                Target Branch
              </InputLabel>
              <Select
                input={<Input id="target-branch" />}
                onChange={handleSelect}
                value={targetBranch}
              >
                {getSelectOptions(["test-pipeline", "sandbox-pipeline"])}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={9} xs={12} style={{ marginTop: 16 }}>
            <CopyTextDisplay
              handleCopy={handleCopy}
              text={`git push -f origin ${branchName}:${targetBranch}`}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
);

export default DeployBranch;
