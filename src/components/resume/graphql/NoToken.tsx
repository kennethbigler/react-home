import * as React from "react";
import Typography from "@mui/material/Typography";

const NoToken: React.FC = React.memo(() => (
  <>
    <Typography>
      You need to generate a personal access token with &quot;repo&quot; and
      &quot;admin:repo_hook&quot; permissions.
    </Typography>
    <Typography>
      This can be done in the Developer settings on GitHub.
    </Typography>
  </>
));

export default NoToken;
