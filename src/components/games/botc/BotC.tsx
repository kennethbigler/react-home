import * as React from "react";
import Typography from "@mui/material/Typography";

const BotC: React.FC = React.memo(() => {
  const someVar = "";

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Blood on the Clocktower
      </Typography>
      <div>{someVar}</div>
    </>
  );
});

export default BotC;
