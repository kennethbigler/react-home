import React, { Component } from 'react';
import types from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import CopyTextDisplay from './CopyTextDisplay';
// Parents: GitTools

export default class BranchName extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    branchMessage: types.string,
    branchName: types.string.isRequired,
    branchPrefix: types.string.isRequired,
    casePreference: types.string.isRequired,
    getSelectOptions: types.func.isRequired,
    gitTheme: types.string.isRequired,
    handleCopy: types.func.isRequired,
    onBranchMessageChange: types.func.isRequired,
    onBranchMessageClear: types.func.isRequired,
    setBranchPrefix: types.func.isRequired,
    setCasePreference: types.func.isRequired,
  };

  /**
   * function to generate select items for branch prefixes
   * @return {[Object]}
   */
  getBranchPrefixOptions = () => {
    const { getSelectOptions } = this.props;
    return getSelectOptions(['chores', 'epics', 'features', 'fixes']);
  };

  /**
   * function to generate select items for case preference
   * @return {[Object]}
   */
  getCasePreferenceOptions = () => {
    const { getSelectOptions } = this.props;
    return getSelectOptions([
      'snake_case',
      'kebab-case',
      'camelCase',
      'No Changes',
    ]);
  };

  /**
   * function to update select state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchPrefixSelect = (e) => {
    const { setBranchPrefix } = this.props;
    setBranchPrefix(e.target.value);
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleCasePrefSelect = (e) => {
    const { setCasePreference } = this.props;
    setCasePreference(e.target.value);
  };

  render() {
    const {
      branchMessage,
      branchName,
      branchPrefix,
      casePreference,
      gitTheme,
      handleCopy,
      onBranchMessageChange,
      onBranchMessageClear,
    } = this.props;

    return (
      <div style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
        <Grid container spacing={16}>
          <Grid item sm={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="branch-prefix" style={{ color: gitTheme }}>
                Branch Prefix
              </InputLabel>
              <Select
                input={<Input id="branch-prefix" />}
                onChange={this.handleBranchPrefixSelect}
                value={branchPrefix}
              >
                {this.getBranchPrefixOptions()}
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
                onChange={this.handleCasePrefSelect}
                value={casePreference}
              >
                {this.getCasePreferenceOptions()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={5} xs={10}>
            <TextField
              fullWidth
              InputLabelProps={{ style: { color: gitTheme } }}
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
  }
}
