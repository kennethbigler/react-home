import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

const Menu = props => {
  return (
    <div>
      <MenuItem onTouchTap={() => props.onClick('/')}>Home</MenuItem>
      <MenuItem onTouchTap={() => props.onClick('/work')}>Work</MenuItem>
      <MenuItem onTouchTap={() => props.onClick('/education')}>
        Education
      </MenuItem>
      <MenuItem onTouchTap={() => props.onClick('/projects')}>
        Projects
      </MenuItem>
      <MenuItem onTouchTap={() => props.onClick('/resume')}>Resume</MenuItem>
      {/* <MenuItem onTouchTap={() => props.onClick("/doug")}>DougScore</MenuItem> */}
      {/* External Links */}
      <Divider />
      <MenuItem href="https://github.com/kennethbigler" rel="noopener">
        GitHub
      </MenuItem>
      <MenuItem href="https://www.linkedin.com/in/kennethbigler" rel="noopener">
        LinkedIn
      </MenuItem>
      {/* Stack Overflow */}
      <Divider />
      <br />
      <a
        href="http://stackoverflow.com/users/4830309/ken-bigler"
        rel="noopener"
      >
        <img
          src="http://stackoverflow.com/users/flair/4830309.png?theme=dark"
          id="stackOverflow"
          style={{ display: 'block', margin: 'auto' }}
          alt="profile for Ken Bigler at Stack Overflow, Q&A for professional and enthusiast programmers"
          title="profile for Ken Bigler at Stack Overflow, Q&A for professional and enthusiast programmers"
        />
      </a>
    </div>
  );
};

Menu.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default Menu;
