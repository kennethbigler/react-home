import React, { useState } from 'react';
import types from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import NavigationClose from '@material-ui/icons/Close';
import { withTheme } from '@material-ui/core/styles';
import TopBar from './TopBar';
// Parents: App

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    children, handleNav, showPlayers, theme: { palette: { type }},
  } = props;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (loc) => {
    setIsOpen(false);
    handleNav(loc);
  };

  const iconColor = type === 'light' ? 'inherit' : 'default';
  const fontColor = type === 'light' ? 'inherit' : 'initial';

  return (
    <div>
      <TopBar toggleOpen={toggleOpen} showPlayers={showPlayers} fontColor={fontColor} iconColor={iconColor} />
      <Drawer onClose={toggleOpen} open={isOpen}>
        <AppBar position="sticky">
          <Toolbar disableGutters>
            <IconButton
              aria-label="Menu Close"
              onClick={toggleOpen}
              color={iconColor}
            >
              <NavigationClose />
            </IconButton>
            <Typography variant="h6" color={fontColor}>
              Menu
            </Typography>
          </Toolbar>
        </AppBar>
        {React.cloneElement(children, { onItemClick: handleNavigation })}
      </Drawer>
    </div>
  );
};

Header.propTypes = {
  children: types.element.isRequired,
  handleNav: types.func.isRequired,
  showPlayers: types.bool,
  theme: types.shape({
    palette: types.shape({
      type: types.string,
    }).isRequired,
  }),
};

Header.defaultProps = {
  showPlayers: false,
};

export default withTheme(Header);
