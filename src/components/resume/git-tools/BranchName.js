// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { CopyTextDisplay } from './CopyTextDisplay';
// material ui
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
// functions
import snakeCase from 'lodash/snakeCase';
// Parents: GitTools

export class BranchName extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    storyID: PropTypes.string,
    getSelectOptions: PropTypes.func.isRequired,
    handleCopy: PropTypes.func.isRequired
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
   * function to generate the branch name from inputs
   * @return {string} format prefix/<story_id>_name_lower_cased
   */
  getBranchName = () => {
    const { storyID } = this.props;
    const { branchPrefix, branchMessage } = this.state;
    const prefix = branchPrefix ? `${branchPrefix}/` : '';
    const id = storyID.replace(/\D/g, '');
    const msg = snakeCase(`${id} ${branchMessage}`);
    return `${prefix}${msg}`;
  };

  render() {
    const { branchPrefix, branchMessage } = this.state;
    const branchName = this.getBranchName();

    return (
      <div className="branch-name">
        <h2>Create Branch Name</h2>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <SelectField
              floatingLabelText="Branch Prefix"
              value={branchPrefix}
              onChange={this.handleBranchPrefixSelect}
            >
              {this.getBranchPrefixOptions()}
            </SelectField>
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              hintText="Summary of User Story"
              floatingLabelText="Branch Name"
              value={branchMessage}
              onChange={this.handleBranchMessageChange}
              multiLine
              fullWidth
            />
          </div>
        </div>
        <CopyTextDisplay text={branchName} handleCopy={this.props.handleCopy} />
      </div>
    );
  }
}
