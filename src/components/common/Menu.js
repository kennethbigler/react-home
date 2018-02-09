import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const Menu = props => {
  // internal redirects
  const home = () => props.onTouchTap('/');
  const work = () => props.onTouchTap('/work');
  const education = () => props.onTouchTap('/education');
  const travel = () => props.onTouchTap('/travel');
  const resume = () => props.onTouchTap('/resume');
  const games = () => props.onTouchTap('/games');
  // external links
  const github = () =>
    window.open('https://github.com/kennethbigler/react-home');
  const linkedin = () =>
    window.open('https://www.linkedin.com/in/kennethbigler');
  const stkovrflw = () =>
    window.open('http://stackoverflow.com/users/4830309/ken-bigler');

  return (
    <div>
      <MenuItem onTouchTap={home} primaryText="Home" />
      <MenuItem onTouchTap={work} primaryText="Work" />
      <MenuItem onTouchTap={education} primaryText="Education" />
      <MenuItem onTouchTap={travel} primaryText="Travel Map" />
      <MenuItem onTouchTap={resume} primaryText="Resume" />
      <MenuItem onTouchTap={games} primaryText="React Games" />
      {/* External Links */}
      <Divider />
      <MenuItem onTouchTap={github} primaryText="GitHub" />
      <MenuItem onTouchTap={linkedin} primaryText="LinkedIn" />
      <Divider />
      <br />
      {/* Stack Overflow */}
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
  onTouchTap: PropTypes.func.isRequired
};
