// React
import React, {Component} from 'react';
import types from 'prop-types';
// Material UI
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
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
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonClick={this.handleOpen}
          onTitleClick={() => this.handleNav('/')}
          style={{position: 'fixed', left: 0, right: 0, top: 0}}
          title="Kenneth Bigler"
          titleStyle={{cursor: 'pointer'}}
        />
        <Drawer docked={false} onRequestChange={this.handleOpen} open={open}>
          <AppBar
            iconElementLeft={
              <IconButton>
                <NavigationClose />
              </IconButton>
            }
            onLeftIconButtonClick={this.handleOpen}
            title="Menu"
          />
          {React.cloneElement(children, {onItemClick: this.handleNav})}
        </Drawer>
      </div>
    );
  }
}
