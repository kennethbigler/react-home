import React from 'react';
import types from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

const Header = (props) => {
  const { authToken, onChange } = props;

  return (
    <div>
      <Typography variant="h2">GraphQL Demo</Typography>
      <TextField
        label="Authorization Code"
        placeholder="some32characterthingfromgithub"
        value={authToken}
        onChange={onChange}
        style={{ margin: '20px 0 20px 0' }}
        fullWidth
      />
    </div>
  );
};

Header.propTypes = {
  authToken: types.string,
  onChange: types.func.isRequired,
};

export default Header;
