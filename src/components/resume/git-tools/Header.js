// react
import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import TextField from 'material-ui/TextField';
// Parents: Main

export const Header = props => {
  const { gitTheme, handleIDChange, storyID } = props;

  return (
    <div>
      <h1>Git Tools</h1>
      <TextField
        floatingLabelFocusStyle={{ color: gitTheme }}
        floatingLabelText="User Story ID"
        hintText="#123456789"
        onChange={handleIDChange}
        style={{ marginLeft: 20 }}
        underlineFocusStyle={{ borderColor: gitTheme }}
        value={storyID}
      />
      <br />
    </div>
  );
};

Header.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  gitTheme: PropTypes.string.isRequired,
  handleIDChange: PropTypes.func.isRequired,
  storyID: PropTypes.string
};
