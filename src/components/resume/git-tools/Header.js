// react
import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
// Parents: Main

export const Header = props => {
  const {
    storyID,
    casePreference,
    handleIDChange,
    handleCasePrefChange
  } = props;

  return (
    <div>
      <h1>Git Tools</h1>
      <div className="row">
        <div className="col-sm-6">
          <TextField
            hintText="#123456789"
            floatingLabelText="User Story ID"
            value={storyID}
            onChange={handleIDChange}
          />
        </div>
        <div className="col-sm-6">
          <SelectField
            floatingLabelText="Case Preference"
            value={casePreference}
            onChange={handleCasePrefChange}
          >
            <MenuItem value={1} primaryText="snake_case" />
            <MenuItem value={2} primaryText="kebab-case" />
            <MenuItem value={3} primaryText="camelCase" />
            <MenuItem value={4} primaryText="No Changes" />
          </SelectField>
        </div>
      </div>
      <br />
    </div>
  );
};

Header.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  storyID: PropTypes.string,
  casePreference: PropTypes.number,
  handleIDChange: PropTypes.func.isRequired,
  handleCasePrefChange: PropTypes.func.isRequired
};
