// react
import React, { Component } from 'react';
// components
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// Parents: Main

export class GitTools extends Component {
  state = {
    value: 1
  };

  getBranchPrefixOptions = () => {
    const arr = ['1', '2', '3', '4', '5'];
    return arr.map((txt, i) => (
      <MenuItem key={i} value={i} primaryText={txt} />
    ));
  };
  getCommitPrefixOptions = () => {
    const arr = ['Never', 'Every Night', 'Weeknights', 'Weekends', 'Weekly'];
    return arr.map((txt, i) => (
      <MenuItem key={i} value={i} primaryText={txt} />
    ));
  };

  handleSelect = (event, index, value) => this.setState({ value });

  render() {
    return (
      <div>
        <h2>Create Branch Name</h2>
        <SelectField
          floatingLabelText="Prefix"
          value={this.state.value}
          onChange={this.handleSelect}
        >
          {this.getBranchPrefixOptions()}
        </SelectField>
        <TextField hintText="#1234567890" floatingLabelText="User Story ID" />
        <TextField
          hintText="Summary of User Story"
          floatingLabelText="Branch Name"
        />
        <hr />
        <h2>Create Commit Message</h2>
        <SelectField
          floatingLabelText="Prefix"
          value={this.state.value}
          onChange={this.handleSelect}
        >
          {this.getCommitPrefixOptions()}
        </SelectField>
        <TextField
          hintText="Summary of Work Done"
          floatingLabelText="Commit Message"
        />
        <Toggle label="Finishes User Story" />
        <TextField hintText="#1234567890" floatingLabelText="User Story ID" />
      </div>
    );
  }
}
