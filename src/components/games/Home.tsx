import React from 'react';
import Typography from '@material-ui/core/Typography';

const wrapperStyles: React.CSSProperties = { textAlign: 'center', marginTop: 20 };

const Home = React.memo(() => (
  <div style={wrapperStyles}>
    <Typography variant="h2">
      Welcome to my ReactJS Game Projects
    </Typography>
    <Typography variant="h3">
      This site was created to learn, check out the
      {' '}
      <a href="https://github.com/kennethbigler/react-home">
        <code>&lt;source&nbsp;code/&gt;</code>
      </a>
    </Typography>
  </div>
));

export default Home;
