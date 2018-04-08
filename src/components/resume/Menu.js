import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const Menu = props => {
  const { onItemClick } = props;
  // internal routes
  const menu = [
    { name: 'Summary', route: '' },
    { divider: true },
    { name: 'Work', route: 'work' },
    { name: 'Education', route: 'education' },
    { name: 'Travel Map', route: 'travel' },
    { name: 'Git Tools', route: 'git-tools' },
    { name: 'Resume', route: 'resume' },
    { divider: true },
    { name: 'React Games', route: 'games' }
  ].map(
    (item, index) =>
      item.divider ? (
        <Divider key={index} />
      ) : (
        <MenuItem
          key={item.name}
          onTouchTap={() => onItemClick(`/${item.route}`)}
          primaryText={item.name}
        />
      )
  );

  // external links
  const github = () =>
    window.open('https://github.com/kennethbigler/react-home');
  const linkedin = () =>
    window.open('https://www.linkedin.com/in/kennethbigler');
  const stkovrflw = () =>
    window.open('http://stackoverflow.com/users/4830309/ken-bigler');

  return (
    <div>
      {menu}
      <Divider />
      <MenuItem onTouchTap={github} primaryText="GitHub" />
      <MenuItem onTouchTap={linkedin} primaryText="LinkedIn" />
      <Divider />
      <br />
      <img
        onTouchTap={stkovrflw}
        src="http://stackoverflow.com/users/flair/4830309.png?theme=dark"
        id="stackOverflow"
        style={{ display: 'block', margin: 'auto', cursor: 'pointer' }}
        alt="profile for Ken Bigler at Stack Overflow, Q&A for professional and enthusiast programmers"
      />
    </div>
  );
};

Menu.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onItemClick: PropTypes.func
};
