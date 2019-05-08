import React, { memo } from 'react';
import types from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import map from 'lodash/map';
// Parents: Header

const Menu = memo((props) => {
  const { onItemClick } = props;
  // internal routes
  const menu = map(
    [
      { name: 'Summary', route: '' },
      { name: 'Work', route: 'work' },
      { name: 'Resume', route: 'resume' },
      { name: 'Hackathons & Education', route: 'education' },
      { divider: true },
      { name: 'Git Tools', route: 'git-tools' },
      { name: 'Cars', route: 'cars' },
      { name: 'Travel Map', route: 'travel' },
      { name: 'Murder Mystery', route: 'murder' },
      { name: 'Poker Night Scores', route: 'poker' },
      // { name: 'GraphQL', route: 'graphql' },
      { divider: true },
      { name: 'React Games', route: 'games' },
    ],
    (item, index) => (item.divider
      ? (
        <Divider key={index} />
      ) : (
        <MenuItem key={item.name} onClick={() => onItemClick(`/${item.route}`)}>
          {item.name}
        </MenuItem>
      )
    ),
  );

  // external links
  const github = () => window.open('https://github.com/kennethbigler/react-home');
  const linkedin = () => window.open('https://www.linkedin.com/in/kennethbigler');
  const stkovrflw = () => window.open('https://stackoverflow.com/users/4830309/ken-bigler');

  return (
    <div>
      {menu}
      <Divider />
      <MenuItem onClick={github}>
        GitHub
      </MenuItem>
      <MenuItem onClick={linkedin}>
        LinkedIn
      </MenuItem>
      <Divider />
      <br />
      <img
        alt="profile for Ken Bigler at Stack Overflow, Q&A for professional and enthusiast programmers"
        id="stackOverflow"
        onClick={stkovrflw}
        src="https://stackoverflow.com/users/flair/4830309.png?theme=dark"
        style={{
          display: 'block',
          margin: 'auto',
          cursor: 'pointer',
          width: 240,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      />
    </div>
  );
});

Menu.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  onItemClick: types.func,
};

export default Menu;
