// react
import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import TextField from 'material-ui/TextField';
// Parents: Main

export const Header = props => {
  const { storyID, handleIDChange } = props;

  return (
    <div>
      <h1>Git Tools</h1>
      <TextField
        hintText="#123456789"
        floatingLabelText="User Story ID"
        value={storyID}
        onChange={handleIDChange}
      />
      <br />
    </div>
  );
};

Header.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  storyID: PropTypes.string,
  handleIDChange: PropTypes.func.isRequired
};
