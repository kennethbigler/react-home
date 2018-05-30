// React
import React, {Component} from 'react';
import types from 'prop-types';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from 'material-ui/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import NavigationClose from '@material-ui/icons/Close';
// Parents: App

export class Header extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    children: types.element.isRequired,
    handleNav: types.func.isRequired,
  };

  state = {open: false};

  handleOpen = () => {
    this.setState({open: !this.state.open});
  };

  handleNav = (loc) => {
    this.setState({open: false});
    this.props.handleNav(loc);
  };

  render() {
    const {open} = this.state;
    const {children} = this.props;
    return (
      <div className="application-header">
        <AppBar
          position="sticky"
          style={{position: 'fixed', left: 0, right: 0, top: 0}}
        >
          <Toolbar>
            <IconButton
              aria-label="Menu"
              color="inherit"
              onClick={this.handleOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              color="inherit"
              onClick={() => this.handleNav('/')}
              style={{cursor: 'pointer'}}
              variant="title"
            >
              Kenneth Bigler
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer docked={false} onRequestChange={this.handleOpen} open={open}>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton
                aria-label="Menu Close"
                color="inherit"
                onClick={this.handleOpen}
              >
                <NavigationClose />
              </IconButton>
              <Typography color="inherit" variant="title">
                Menu
              </Typography>
            </Toolbar>
          </AppBar>
          {React.cloneElement(children, {onItemClick: this.handleNav})}
        </Drawer>
      </div>
    );
  }
}
