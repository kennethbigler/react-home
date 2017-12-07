import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
import Menu from './features/Menu';
import photo from '../images/ken.jpg';

class HeaderBody extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  onTouchTap = () => {
    this.setState({ open: !this.state.open });
  };

  handleNav = loc => {
    this.setState({ open: false });
    this.props.history.push(loc);
  };

  render() {
    const title = (
      <div>
        <Avatar src={photo} size={30} /> Kenneth Bigler
      </div>
    );
    return (
      <div>
        <AppBar
          title={title}
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
          <Menu onClick={this.handleNav} />
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

const Header = withRouter(HeaderBody);

export default Header;
