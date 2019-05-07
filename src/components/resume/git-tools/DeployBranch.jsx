import React, { useState } from 'react';
import types from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import CopyTextDisplay from './CopyTextDisplay';
// Parents: GitTools

const BranchName = (props) => {
  const [targetBranch, setTargetBranch] = useState('test-pipeline');

  const handleSelect = (e) => {
    setTargetBranch(e.target.value);
  };

  const {
    gitTheme, handleCopy, getSelectOptions, branchName,
  } = props;

  return (
    <div style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
      <Grid container spacing={16} style={{ display: 'flex', alignItems: 'center' }}>
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
};

BranchName.propTypes = {
  branchName: types.string.isRequired,
  getSelectOptions: types.func.isRequired,
  gitTheme: types.string.isRequired,
  handleCopy: types.func.isRequired,
};

export default BranchName;
