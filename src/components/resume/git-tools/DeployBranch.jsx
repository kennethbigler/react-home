import React, { Component } from 'react';
import types from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import CopyTextDisplay from './CopyTextDisplay';
// Parents: GitTools

export default class BranchName extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    branchName: types.string.isRequired,
    getSelectOptions: types.func.isRequired,
    gitTheme: types.string.isRequired,
    handleCopy: types.func.isRequired,
  };

  state = {
    targetBranch: 'test-pipeline',
  }

  handleSelect = (e) => {
    this.setState({ targetBranch: e.target.value });
  }

  render() {
    const { targetBranch } = this.state;
    const {
      gitTheme, handleCopy, getSelectOptions, branchName,
    } = this.props;

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
                onChange={this.handleSelect}
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
  }
}
