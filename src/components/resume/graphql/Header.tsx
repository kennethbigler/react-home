import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

interface HeaderProps {
  authToken?: string;
  onChange: React.ChangeEventHandler;
}

const Header: React.FC<HeaderProps> = React.memo((props: HeaderProps) => {
  const { authToken, onChange } = props;

  return (
    <>
      <Typography variant="h2">GraphQL Demo</Typography>
      <TextField
        label="Authorization Code"
        placeholder="some 32 character string from github"
        value={authToken}
        onChange={onChange}
        style={{ margin: '20px 0 20px 0' }}
        fullWidth
      />
    </>
  );
});

export default Header;
