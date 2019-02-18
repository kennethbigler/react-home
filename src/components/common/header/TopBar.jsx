import React, { PureComponent } from 'react';
import types from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SimplePopover from '../ButtonPopover';
import PlayerMenu from './PlayerMenu';
// Parents: App

const styles = {
  flexLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  flexRight: {
    display: 'flex',
    marginRight: 15,
  },
};

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
          <div className="flex-container">
            <div style={styles.flexLeft}>
              <IconButton
                aria-label="Menu"
                onClick={toggleOpen}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                onClick={toggleOpen}
                style={{ cursor: 'pointer' }}
                variant="h6"
              >
                Menu
              </Typography>
            </div>
            {showPlayers && (
              <div style={styles.flexRight}>
                <SimplePopover buttonText="Players">
                  <PlayerMenu />
                </SimplePopover>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
