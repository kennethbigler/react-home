import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface HeaderProps {
  gitTheme: string;
  onIdChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  storyID?: string;
}

const validId = RegExp("[A-Z]{4}-[a-zA-Z0-9]+");

const Header: React.FC<HeaderProps> = React.memo((props: HeaderProps) => {
  const { onIdChange, storyID, gitTheme } = props;

  const isIdValid = storyID && validId.test(storyID);

  return (
    <>
      <Typography variant="h2">Git Tools</Typography>
      <TextField
        InputLabelProps={{ style: { color: gitTheme } }}
        label="User Story ID"
        onChange={onIdChange}
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
