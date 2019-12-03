import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { DBRootState } from '../../../store/types';

interface TopBarProps {
  fontColor: 'inherit' | 'initial' | 'error' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | undefined;
  iconColor: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  showPlayers?: boolean;
  toggleOpen: React.MouseEventHandler;
}

const flexLeftStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};
const flexRightStyles: React.CSSProperties = {
  display: 'flex',
  marginRight: 15,
};
const spanTopStyles: React.CSSProperties = { left: 0, right: 0, top: 0 };

const TopBar: React.FC<TopBarProps> = React.memo((props: TopBarProps) => {
  const theme = useSelector((state: DBRootState) => state.theme);
  const dispatch = useDispatch();

  const [checked, setChecked] = React.useState(theme.type !== 'dark');

  const toggleTheme = React.useCallback(
    (): void => {
      checked
        ? dispatch(displayDarkTheme())
        : dispatch(displayLightTheme());
      setChecked(!checked);
    },
    [checked, dispatch],
  );

  const {
    toggleOpen, showPlayers, fontColor, iconColor,
  } = props;

  return (
    <AppBar style={spanTopStyles}>
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
            <Switch checked={checked} onChange={toggleTheme} />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
});

TopBar.defaultProps = {
  showPlayers: false,
};

export default TopBar;
