// react
import React, { memo } from 'react';
import types from 'prop-types';
// material-ui
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
// Parents: Main

const validId = RegExp('[A-Z]{4}-[a-zA-Z0-9]+');

const Header = memo((props) => {
  const { handleIDChange, storyID, gitTheme } = props;

  const isIdValid = validId.test(storyID);

  return (
    <>
      <Typography variant="h2">
        Git Tools
      </Typography>
      <TextField
        InputLabelProps={{ style: { color: gitTheme }}}
        label="User Story ID"
        onChange={handleIDChange}
        placeholder="GNAP-12345"
        style={{ marginLeft: 20 }}
        value={storyID}
        error={!isIdValid}
      />
      <br />
    </>
  );
});

Header.propTypes = {
  gitTheme: types.string.isRequired,
  handleIDChange: types.func.isRequired,
  storyID: types.string,
};

export default Header;
