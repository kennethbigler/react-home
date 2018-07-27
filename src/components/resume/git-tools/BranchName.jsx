// react
import React, { Component } from 'react';
import types from 'prop-types';
// components
// material ui
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
// functions
import snakeCase from 'lodash/snakeCase';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import replace from 'lodash/replace';
import CopyTextDisplay from './CopyTextDisplay';
import ExpandableCard from '../../common/ExpandableCard';
// Parents: GitTools

export default class BranchName extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    branchPrefix: types.string.isRequired,
    casePreference: types.string.isRequired,
    getSelectOptions: types.func.isRequired,
    gitTheme: types.string.isRequired,
    handleCopy: types.func.isRequired,
    setBranchPrefix: types.func.isRequired,
    setCasePreference: types.func.isRequired,
    storyID: types.string,
  };

  state = { branchMessage: '' };

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
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const { branchPrefix, casePreference, storyID } = this.props;
    const { branchMessage } = this.state;
    const prefix = branchPrefix ? `${branchPrefix}/` : '';
    const id = replace(storyID, /\D/g, '');
    let msg;
    switch (casePreference) {
      case 'snake_case':
        msg = snakeCase(`${id} ${branchMessage}`);
        break;
      case 'kebab-case':
        msg = kebabCase(`${id} ${branchMessage}`);
        break;
      case 'camelCase':
        msg = camelCase(`${id} ${branchMessage}`);
        break;
      default:
        msg = `${id} ${branchMessage}`;
    }
    return `${prefix}${msg}`;
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

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchMessageChange = (e) => {
    this.setState({ branchMessage: e.target.value });
  };

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchMessageClear = () => {
    this.setState({ branchMessage: '' });
  };

  render() {
    const { branchMessage } = this.state;
    const {
      branchPrefix, casePreference, gitTheme, handleCopy,
    } = this.props;
    const branchName = this.getBranchName();

    return (
      <ExpandableCard backgroundColor={gitTheme} title="Create Branch Name">
        <div
          className="branch-name"
          style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}
        >
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
                onChange={this.handleBranchMessageChange}
                placeholder="Summary of User Story"
                value={branchMessage}
              />
            </Grid>
            <Grid item sm={1} xs={2}>
              <IconButton
                onClick={this.handleBranchMessageClear}
                style={{ marginTop: 12 }}
              >
                <Clear />
              </IconButton>
            </Grid>
          </Grid>
          <CopyTextDisplay handleCopy={handleCopy} text={branchName} />
        </div>
      </ExpandableCard>
    );
  }
}
