import React, { PureComponent } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import SimplePopover from '../ButtonPopover';
import PlayerMenu from './PlayerMenu';
import {
  displayDarkTheme,
  displayLightTheme,
} from '../../../store/modules/theme';
import styles from './TopBar.styles';
// Parents: App

class TopBar extends PureComponent {
  constructor(props) {
    super(props);
    const { theme } = props;

    if (theme.type === 'dark') {
      this.state = { checked: false, toggleSwitch: this.toLightTheme };
    } else {
      this.state = { checked: true, toggleSwitch: this.toDarkTheme };
    }
  }

  toDarkTheme = () => {
    const { themeActions } = this.props;
    themeActions.displayDarkTheme();
    this.setState({ checked: false, toggleSwitch: this.toLightTheme });
  };

  toLightTheme = () => {
    const { themeActions } = this.props;
    themeActions.displayLightTheme();
    this.setState({ checked: true, toggleSwitch: this.toDarkTheme });
  };

  render() {
    const {
      toggleOpen, showPlayers, fontColor, iconColor,
    } = this.props;
    const { checked, toggleSwitch } = this.state;
    return (
      <AppBar style={{ left: 0, right: 0, top: 0 }}>
        <Toolbar disableGutters>
          <div className="flex-container">
            <div style={styles.flexLeft}>
              <IconButton
                aria-label="Menu"
                onClick={toggleOpen}
                color={iconColor}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                onClick={toggleOpen}
                style={{ cursor: 'pointer' }}
                variant="h6"
                color={fontColor}
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
            <div style={styles.flexRight}>
              <Switch checked={checked} onChange={toggleSwitch} />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  fontColor: types.string.isRequired,
  iconColor: types.string.isRequired,
  showPlayers: types.bool,
  theme: types.shape({
    type: types.string,
  }),
  themeActions: types.shape({
    displayDarkTheme: types.func.isRequired,
    displayLightTheme: types.func.isRequired,
  }),
  toggleOpen: types.func.isRequired,
};

TopBar.defaultProps = {
  showPlayers: false,
};

// react-redux export
const mapStateToProps = (state) => ({
  theme: state.theme,
});
const mapDispatchToProps = (dispatch) => ({
  themeActions: bindActionCreators(
    { displayDarkTheme, displayLightTheme },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
