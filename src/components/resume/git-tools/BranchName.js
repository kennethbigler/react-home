// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { CopyTextDisplay } from './CopyTextDisplay';
// material ui
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
// functions
import snakeCase from 'lodash/snakeCase';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
// Parents: GitTools

export class BranchName extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    storyID: PropTypes.string,
    getSelectOptions: PropTypes.func.isRequired,
    handleCopy: PropTypes.func.isRequired,
    casePreference: PropTypes.number.isRequired
  };

  state = {
    branchPrefix: 'features',
    branchMessage: ''
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
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const { storyID, casePreference } = this.props;
    const { branchPrefix, branchMessage } = this.state;
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
    const { branchPrefix, branchMessage } = this.state;
    const branchName = this.getBranchName();

    return (
      <div className="branch-name">
        <h2>Create Branch Name</h2>
        <div className="row">
          <div className="col-sm-6">
            <SelectField
              floatingLabelText="Branch Prefix"
              value={branchPrefix}
              onChange={this.handleBranchPrefixSelect}
            >
              {this.getBranchPrefixOptions()}
            </SelectField>
          </div>
          <div className="col-sm-6">
            <TextField
              hintText="Summary of User Story"
              floatingLabelText="Branch Name"
              value={branchMessage}
              onChange={this.handleBranchMessageChange}
              multiLine
              fullWidth
            />
            <IconButton
              onTouchTap={this.handleBranchMessageClear}
              style={{ marginLeft: -50 }}
            >
              <Clear />
            </IconButton>
          </div>
        </div>
        <CopyTextDisplay text={branchName} handleCopy={this.props.handleCopy} />
      </div>
    );
  }
}
