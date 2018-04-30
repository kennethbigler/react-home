// react
import React, { Component } from 'react';
import types from 'prop-types';
// components
import { ExpandableCard } from '../../common/ExpandableCard';
import { CopyTextDisplay } from './CopyTextDisplay';
// material ui
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import { deepOrange600 } from 'material-ui/styles/colors';
// functions
import snakeCase from 'lodash/snakeCase';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
// Parents: GitTools

export class BranchName extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    branchPrefix: types.string.isRequired,
    casePreference: types.string.isRequired,
    getSelectOptions: types.func.isRequired,
    gitTheme: types.string.isRequired,
    handleCopy: types.func.isRequired,
    setBranchPrefix: types.func.isRequired,
    setCasePreference: types.func.isRequired,
    storyID: types.string
  };

  state = { branchMessage: '' };

  /**
   * function to generate select items for branch prefixes
   * @return {[Object]}
   */
  getBranchPrefixOptions = () =>
    this.props.getSelectOptions(['chores', 'epics', 'features', 'fixes']);

  /**
   * function to generate select items for case preference
   * @return {[Object]}
   */
  getCasePreferenceOptions = () =>
    this.props.getSelectOptions([
      'snake_case',
      'kebab-case',
      'camelCase',
      'No Changes'
    ]);

  /**
   * function to update select state based on value
   * @param {Object} e event fired when select occurs
   * @param {number} i index of option selected
   * @param {number} v value of option selected
   */
  handleBranchPrefixSelect = (e, i, v) => this.props.setBranchPrefix(v);
  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   * @param {number} i index of select option
   * @param {number} v value of select option
   */
  handleCasePrefSelect = (e, i, v) => this.props.setCasePreference(v);

  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchMessageChange = e =>
    this.setState({ branchMessage: e.target.value });
  /**
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   */
  handleBranchMessageClear = () => this.setState({ branchMessage: '' });

  /**
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const { branchPrefix, casePreference, storyID } = this.props;
    const { branchMessage } = this.state;
    const prefix = branchPrefix ? `${branchPrefix}/` : '';
    const id = storyID.replace(/\D/g, '');
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

  render() {
    const { branchMessage } = this.state;
    const { branchPrefix, casePreference, gitTheme, handleCopy } = this.props;
    const branchName = this.getBranchName();

    return (
      <ExpandableCard
        title="Create Branch Name"
        backgroundColor={deepOrange600}
      >
        <div
          className="branch-name"
          style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}
        >
          <div className="row">
            <div className="col-sm-3">
              <SelectField
                style={{ maxWidth: '100%' }}
                floatingLabelStyle={{ color: gitTheme }}
                floatingLabelText="Branch Prefix"
                onChange={this.handleBranchPrefixSelect}
                selectedMenuItemStyle={{ color: gitTheme }}
                underlineFocusStyle={{ borderColor: gitTheme }}
                value={branchPrefix}
              >
                {this.getBranchPrefixOptions()}
              </SelectField>
            </div>
            <div className="col-sm-3">
              <SelectField
                style={{ maxWidth: '100%' }}
                floatingLabelStyle={{ color: gitTheme }}
                floatingLabelText="Case Preference"
                onChange={this.handleCasePrefSelect}
                selectedMenuItemStyle={{ color: gitTheme }}
                underlineFocusStyle={{ borderColor: gitTheme }}
                value={casePreference}
              >
                {this.getCasePreferenceOptions()}
              </SelectField>
            </div>
            <div className="col-sm-5 col-10">
              <TextField
                floatingLabelFocusStyle={{ color: gitTheme }}
                floatingLabelText="Branch Name"
                fullWidth
                hintText="Summary of User Story"
                multiLine
                onChange={this.handleBranchMessageChange}
                underlineFocusStyle={{ borderColor: gitTheme }}
                value={branchMessage}
              />
            </div>
            <div className="col-sm-1 col-2">
              <IconButton
                onClick={this.handleBranchMessageClear}
                style={{ marginTop: 20 }}
              >
                <Clear />
              </IconButton>
            </div>
          </div>
          <CopyTextDisplay text={branchName} handleCopy={handleCopy} />
        </div>
      </ExpandableCard>
    );
  }
}
