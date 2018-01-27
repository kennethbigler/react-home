import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from './features/Menu';
import { MenuCasino } from './features/MenuCasino';
import photo from '../images/ken.jpg';
import { withRouter } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
// Parents: App

class HeaderBody extends Component {
  constructor(props) {
    super(props);
    const isCasino = props.location.pathname.includes('/casino');
    this.state = { open: false, isCasino };
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    if (pathname !== this.props.location.pathname) {
      this.setState({ isCasino: pathname.includes('/casino') });
    }
  }

  onTouchTap = () => {
    this.setState({ open: !this.state.open });
  };

  handleNav = loc => {
    this.setState({ open: false });
    if (loc !== this.props.location.pathname) {
      this.props.history.push(loc);
    }
  };

  render() {
    const { isCasino } = this.state;
    const casinoMenu = <MenuCasino onTouchTap={this.handleNav} />;
    const resumeMenu = <Menu onTouchTap={this.handleNav} />;
    const title = (
      <div>
        <Avatar src={photo} size={30} /> Kenneth Bigler
      </div>
    );
    return (
      <div>
        <div style={{ height: '4em' }}>&nbsp;</div>
        <AppBar
          title={title}
          style={{ position: 'fixed', left: 0, right: 0, top: 0 }}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.onTouchTap}
          onTitleTouchTap={() => this.handleNav('/')}
        />
        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={this.onTouchTap}
        >
          <AppBar
            title="Menu"
            iconElementLeft={
              <IconButton>
                <NavigationClose />
              </IconButton>
            }
            onLeftIconButtonTouchTap={this.onTouchTap}
            onTitleTouchTap={() => this.handleNav('/')}
          />
          {isCasino ? casinoMenu : resumeMenu}
        </Drawer>
      </div>
    );
  }
}

HeaderBody.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export const Header = withRouter(HeaderBody);
