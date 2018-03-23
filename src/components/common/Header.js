// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Assets
import photo from '../../images/ken.jpg';
// Material UI
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
// Parents: App

export class Header extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    children: PropTypes.object.isRequired,
    handleNav: PropTypes.func.isRequired
  };

  state = { open: false };
  styles = {
    height: { height: '4em' },
    header: { position: 'fixed', left: 0, right: 0, top: 0 }
  };

  handleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleNav = loc => {
    this.setState({ open: false });
    this.props.handleNav(loc);
  };

  render() {
    const { open } = this.state;
    const { children } = this.props;
    const { height, header } = this.styles;
    const title = (
      <div>
        <Avatar src={photo} size={30} /> Kenneth Bigler
      </div>
    );
    return (
      <div>
        <div style={height}>&nbsp;</div>
        <AppBar
          title={title}
          style={header}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.handleOpen}
          onTitleTouchTap={() => this.handleNav('/')}
        />
        <Drawer open={open} docked={false} onRequestChange={this.handleOpen}>
          <AppBar
            title="Menu"
            iconElementLeft={
              <IconButton>
                <NavigationClose />
              </IconButton>
            }
            onLeftIconButtonTouchTap={this.handleOpen}
            onTitleTouchTap={() => this.handleNav('/')}
          />
          {React.cloneElement(children, { onItemClick: this.handleNav })}
        </Drawer>
      </div>
    );
  }
}
