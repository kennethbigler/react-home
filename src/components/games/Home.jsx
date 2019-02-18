import React from 'react';
import Typography from '@material-ui/core/Typography';
// Parents: Main

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
const Home = () => (
  <div style={{ textAlign: 'center' }}>
    <Typography variant="h2">
      Welcome to my ReactJS Game Projects
    </Typography>
    <Typography variant="h3">
      This site was created to learn, check out the
      {' '}
      <a href="https://github.com/kennethbigler/react-home">
        {'<source code />'}
      </a>
    </Typography>
  </div>
);

export default Home;
