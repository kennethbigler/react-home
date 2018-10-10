// React
import React, { PureComponent } from 'react';
import types from 'prop-types';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
// components
import SimplePopover from '../ButtonPopover';
import PlayerMenu from './PlayerMenu';
// Parents: App

class TopBar extends PureComponent {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    toggleOpen: types.func.isRequired,
    showPlayers: types.bool,
  };

  static defaultProps = {
    showPlayers: false,
  }

  render() {
    const { toggleOpen, showPlayers } = this.props;
    return (
      <AppBar style={{ left: 0, right: 0, top: 0 }}>
        <Toolbar disableGutters>
          <IconButton
            aria-label="Menu"
            color="inherit"
            onClick={toggleOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color="inherit"
            onClick={toggleOpen}
            style={{ cursor: 'pointer', marginRight: 15 }}
            variant="h6"
          >
            Menu
          </Typography>
          {showPlayers && (
            <SimplePopover buttonText="Players">
              <PlayerMenu />
            </SimplePopover>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
