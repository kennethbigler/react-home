import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
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
import { DBUITheme, DBRootState } from '../../../store/types';

interface ThemeActions {
  displayDarkTheme: Function;
  displayLightTheme: Function;
}
interface TopBarProps {
  fontColor: 'inherit' | 'initial' | 'error' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | undefined;
  iconColor: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  showPlayers?: boolean;
  theme: DBUITheme;
  themeActions: ThemeActions;
  toggleOpen: React.MouseEventHandler;
}
interface TopBarState {
  checked: boolean;
  toggleSwitch: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const flexLeftStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};
const flexRightStyles: React.CSSProperties = {
  display: 'flex',
  marginRight: 15,
};

class TopBar extends PureComponent<TopBarProps, TopBarState> {
  static defaultProps: {
    showPlayers: boolean;
  };

  constructor(props: TopBarProps) {
    super(props);
    const { theme } = props;

    if (theme.type === 'dark') {
      this.state = { checked: false, toggleSwitch: this.toLightTheme };
    } else {
      this.state = { checked: true, toggleSwitch: this.toDarkTheme };
    }
  }

  toDarkTheme = (): void => {
    const { themeActions } = this.props;
    themeActions.displayDarkTheme();
    this.setState({ checked: false, toggleSwitch: this.toLightTheme });
  };

  toLightTheme = (): void => {
    const { themeActions } = this.props;
    themeActions.displayLightTheme();
    this.setState({ checked: true, toggleSwitch: this.toDarkTheme });
  };

  render(): React.ReactNode {
    const {
      toggleOpen, showPlayers, fontColor, iconColor,
    } = this.props;
    const { checked, toggleSwitch } = this.state;
    return (
      <AppBar style={{ left: 0, right: 0, top: 0 }}>
        <Toolbar disableGutters>
          <div className="flex-container">
            <div style={flexLeftStyles}>
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
              <div style={flexRightStyles}>
                <SimplePopover buttonText="Players">
                  <PlayerMenu />
                </SimplePopover>
              </div>
            )}
            <div style={flexRightStyles}>
              <Switch checked={checked} onChange={toggleSwitch} />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

// react-redux export
const mapStateToProps = (state: DBRootState): { theme: DBUITheme } => ({
  theme: state.theme,
});
const mapDispatchToProps = (dispatch: Dispatch): { themeActions: ThemeActions } => ({
  themeActions: bindActionCreators(
    { displayDarkTheme, displayLightTheme },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
