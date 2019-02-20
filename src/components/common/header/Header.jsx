import React, { PureComponent } from 'react';
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

class Header extends PureComponent {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    children: types.element.isRequired,
    handleNav: types.func.isRequired,
    showPlayers: types.bool,
    theme: types.shape({
      palette: types.shape({
        type: types.string,
      }).isRequired,
    }),
  };

  static defaultProps = {
    showPlayers: false,
  }

  state = { open: false };

  toggleOpen = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  handleNav = (loc) => {
    const { handleNav } = this.props;
    this.setState({ open: false });
    handleNav(loc);
  };

  render() {
    const { open } = this.state;
    const { children, showPlayers, theme: { palette: { type } } } = this.props;
    const fontColor = type === 'light' ? 'inherit' : 'default';

    return (
      <div>
        <TopBar toggleOpen={this.toggleOpen} showPlayers={showPlayers} fontColor={fontColor} />
        <Drawer onClose={this.toggleOpen} open={open}>
          <AppBar position="sticky">
            <Toolbar disableGutters>
              <IconButton
                aria-label="Menu Close"
                onClick={this.toggleOpen}
                color={fontColor}
              >
                <NavigationClose />
              </IconButton>
              <Typography variant="h6" color={fontColor}>
                Menu
              </Typography>
            </Toolbar>
          </AppBar>
          {React.cloneElement(children, { onItemClick: this.handleNav })}
        </Drawer>
      </div>
    );
  }
}

export default withTheme()(Header);
