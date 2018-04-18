// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { ExpandableCard } from '../../common/ExpandableCard';
import { CopyTextDisplay } from './CopyTextDisplay';
// material ui
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
    // PropTypes = [string, object, bool, number, func, array].isRequired
    getSelectOptions: PropTypes.func.isRequired,
    gitTheme: PropTypes.string.isRequired,
    handleCopy: PropTypes.func.isRequired,
    storyID: PropTypes.string
  };

  state = {
    branchPrefix: 'features',
    branchMessage: '',
    casePreference: 1
  };

  /**
   * function to generate select items based of input
   * @param {[string]} arr input array of options
   * @return {[Object]}
   */
  getBranchPrefixOptions = () =>
    this.props.getSelectOptions(['chores', 'epics', 'features', 'fixes']);

  /**
   * function to update select state based on value
   * @param {Object} e event fired when select occurs
   * @param {number} i index of option selected
   * @param {number} v value of option selected
   */
  handleBranchPrefixSelect = (e, i, v) => this.setState({ branchPrefix: v });

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
   * function to update text state based on value
   * @param {Object} e event fired when select occurs
   * @param {number} i index of select option
   * @param {number} v value of select option
   */
  handleCasePrefChange = (e, i, v) => this.setState({ casePreference: v });

  /**
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const { storyID } = this.props;
    const { branchPrefix, branchMessage, casePreference } = this.state;
    const prefix = branchPrefix ? `${branchPrefix}/` : '';
    const id = storyID.replace(/\D/g, '');
    let msg;
    switch (casePreference) {
      case 1:
        msg = snakeCase(`${id} ${branchMessage}`);
        break;
      case 2:
        msg = kebabCase(`${id} ${branchMessage}`);
        break;
      case 3:
        msg = camelCase(`${id} ${branchMessage}`);
        break;
      default:
        msg = `${id} ${branchMessage}`;
    }
    return `${prefix}${msg}`;
  };

  render() {
    const { branchPrefix, branchMessage, casePreference } = this.state;
    const { gitTheme, handleCopy } = this.props;
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
                floatingLabelStyle={{ color: gitTheme }}
                floatingLabelText="Case Preference"
                onChange={this.handleCasePrefChange}
                selectedMenuItemStyle={{ color: gitTheme }}
                underlineFocusStyle={{ borderColor: gitTheme }}
                value={casePreference}
              >
                <MenuItem value={1} primaryText="snake_case" />
                <MenuItem value={2} primaryText="kebab-case" />
                <MenuItem value={3} primaryText="camelCase" />
                <MenuItem value={4} primaryText="No Changes" />
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
