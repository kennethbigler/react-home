import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import CopyTextDisplay from './CopyTextDisplay';
import { MaterialSelectEvent } from './types';

interface DeployBranchProps {
  branchName: string;
  getSelectOptions: (arr: string[]) => React.ReactNode;
  gitTheme: string;
  handleCopy: (text: string) => boolean;
}

const DeployBranch: React.FC<DeployBranchProps> = React.memo((props: DeployBranchProps) => {
  const [targetBranch, setTargetBranch] = React.useState('test-pipeline');

  const handleSelect = React.useCallback((e: MaterialSelectEvent): void => {
    setTargetBranch(e.target.value as string);
  }, [setTargetBranch]);

  const {
    gitTheme, handleCopy, getSelectOptions, branchName,
  } = props;

  return (
    <div style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
      <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center' }}>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="target-branch" style={{ color: gitTheme }}>
              Target Branch
            </InputLabel>
            <Select
              input={<Input id="target-branch" />}
              onChange={handleSelect}
              value={targetBranch}
            >
              {getSelectOptions(['test-pipeline', 'sandbox-pipeline'])}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={9} xs={12}>
          <CopyTextDisplay handleCopy={handleCopy} text={`git push -f origin ${branchName}:${targetBranch}`} />
        </Grid>
      </Grid>
    </div>
  );
});

export default DeployBranch;
