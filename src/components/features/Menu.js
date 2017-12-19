import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

const github = 'https://github.com/kennethbigler';
const linkedin = 'https://www.linkedin.com/in/kennethbigler';
const stkovrflw = 'http://stackoverflow.com/users/4830309/ken-bigler';

export const Menu = props => {
  const home = () => props.onClick('/');
  const work = () => props.onClick('/work');
  const education = () => props.onClick('/education');
  const projects = () => props.onClick('/projects');
  const resume = () => props.onClick('/resume');
  // const casino = () => props.onClick('/casino');

  return (
    <div>
      <MenuItem onTouchTap={home}>Home</MenuItem>
      <MenuItem onTouchTap={work}>Work</MenuItem>
      <MenuItem onTouchTap={education}>Education</MenuItem>
      <MenuItem onTouchTap={projects}>Projects</MenuItem>
      <MenuItem onTouchTap={resume}>Resume</MenuItem>
      {/* <MenuItem onTouchTap={casino}>Casino</MenuItem> */}
      {/* External Links */}
      <Divider />
      <MenuItem href={github} rel="noopener">
        GitHub
      </MenuItem>
      <MenuItem href={linkedin} rel="noopener">
        LinkedIn
      </MenuItem>
      {/* Stack Overflow */}
      <Divider />
      <br />
      <a href={stkovrflw} rel="noopener">
        <img
          src="http://stackoverflow.com/users/flair/4830309.png?theme=dark"
          id="stackOverflow"
          style={{ display: 'block', margin: 'auto' }}
          alt="profile for Ken Bigler at Stack Overflow, Q&A for professional and enthusiast programmers"
        />
      </a>
    </div>
  );
};

Menu.propTypes = {
  onClick: PropTypes.func.isRequired
};
