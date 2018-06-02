// react
import React from 'react';
import types from 'prop-types';
// material-ui
import TextField from '@material-ui/core/TextField';
// Parents: Main

export const Header = (props) => {
  const {handleIDChange, storyID} = props;

  return (
    <div>
      <h1>Git Tools</h1>
      <TextField
        InputLabelProps={{style: {color: props.gitTheme}}}
        label="User Story ID"
        onChange={handleIDChange}
        placeholder="#123456789"
        style={{marginLeft: 20}}
        value={storyID}
      />
      <br />
    </div>
  );
};

Header.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  gitTheme: types.string.isRequired,
  handleIDChange: types.func.isRequired,
  storyID: types.string,
};
