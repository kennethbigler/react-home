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
    return (
      <div className="application-header">
        <AppBar
          title={
            <div>
              <Avatar src={photo} size={30} /> Kenneth Bigler
            </div>
          }
          style={{ position: 'fixed', left: 0, right: 0, top: 0 }}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonClick={this.handleOpen}
          onTitleClick={() => this.handleNav('/')}
          titleStyle={{ cursor: 'pointer' }}
        />
        <Drawer open={open} docked={false} onRequestChange={this.handleOpen}>
          <AppBar
            title="Menu"
            iconElementLeft={
              <IconButton>
                <NavigationClose />
              </IconButton>
            }
            onLeftIconButtonClick={this.handleOpen}
          />
          {React.cloneElement(children, { onItemClick: this.handleNav })}
        </Drawer>
      </div>
    );
  }
}
