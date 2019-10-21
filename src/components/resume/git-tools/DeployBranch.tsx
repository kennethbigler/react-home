import React, { useState, memo } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import CopyTextDisplay from './CopyTextDisplay';

interface BranchNameProps {
  branchName: string;
  getSelectOptions: Function;
  gitTheme: string;
  handleCopy: Function;
}

const BranchName: React.FC<BranchNameProps> = memo((props: BranchNameProps) => {
  const [targetBranch, setTargetBranch] = useState('test-pipeline');

  const handleSelect = (e: React.ChangeEvent<any>): void => {
    setTargetBranch(e.target.value);
  };

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

export default BranchName;
