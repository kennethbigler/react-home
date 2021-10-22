import React from 'react';
import { Typography } from '@mui/material';

const NoToken: React.FC = React.memo(() => (
  <>
    <Typography variant="h6">
      You need to generate a personal access token with &quot;repo&quot; and &quot;admin:repo_hook&quot; permissions.
    </Typography>
    <Typography variant="h6">
      This can be done in the Developer settings on GitHub.
    </Typography>
  </>
));

export default NoToken;
