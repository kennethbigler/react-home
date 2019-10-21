import React, { memo } from 'react';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

interface HeaderProps {
  gitTheme: string;
  handleIDChange: React.ChangeEventHandler;
  storyID?: string;
}

const validId = RegExp('[A-Z]{4}-[a-zA-Z0-9]+');

const Header: React.FC<HeaderProps> = memo((props: HeaderProps) => {
  const { handleIDChange, storyID, gitTheme } = props;

  const isIdValid = storyID && validId.test(storyID);

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

export default Header;
