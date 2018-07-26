// React
import React, { Component } from 'react';
import types from 'prop-types';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import NavigationClose from '@material-ui/icons/Close';
// Parents: App

export default class Header extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    children: types.element.isRequired,
    handleNav: types.func.isRequired,
  };

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
    const { children } = this.props;
    return (
      <div className="application-header">
        <AppBar style={{ left: 0, right: 0, top: 0 }}>
          <Toolbar disableGutters>
            <IconButton
              aria-label="Menu"
              color="inherit"
              onClick={this.toggleOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              color="inherit"
              onClick={() => this.handleNav('/')}
              style={{ cursor: 'pointer' }}
              variant="title"
            >
              Kenneth Bigler
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer onClose={this.toggleOpen} open={open}>
          <AppBar position="sticky">
            <Toolbar disableGutters>
              <IconButton
                aria-label="Menu Close"
                color="inherit"
                onClick={this.toggleOpen}
              >
                <NavigationClose />
              </IconButton>
              <Typography color="inherit" variant="title">
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
