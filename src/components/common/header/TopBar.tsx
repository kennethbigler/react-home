import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import SimplePopover from './ButtonPopover';
import PlayerMenu from './PlayerMenu';
import {
  displayDarkTheme,
  displayLightTheme,
} from '../../../store/modules/theme';
import { DBRootState } from '../../../store/types';

const cursorStyles: React.CSSProperties = { cursor: 'pointer' };
const flexLeftStyles: React.CSSProperties = { display: 'flex', alignItems: 'center' };
const flexRightStyles: React.CSSProperties = { display: 'flex', marginRight: 15 };
const spanTopStyles: React.CSSProperties = { left: 0, right: 0, top: 0 };

interface TopBarProps {
  /** change the color scheme of the Menu text */
  fontColor: TypographyProps['color'];
  /** change the color scheme of the icon */
  iconColor: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  /** show/hide the player editor button */
  showPlayers: boolean;
  /** callback called onClick of Icon or Menu text */
  toggleOpen: React.MouseEventHandler;
}

const TopBar = (props: TopBarProps): React.ReactElement => {
  const theme = useSelector((state: DBRootState) => state.theme);
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(theme.type !== 'dark');

  /** function toggle between site's light and dark theme - dispatch to Redux */
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
    <AppBar style={spanTopStyles} className={`header-${theme.type}-theme`}>
      <Toolbar disableGutters>
        <div className="flex-container">
          <div style={flexLeftStyles}>
            <IconButton
              aria-label="Menu"
              onClick={toggleOpen}
              color={iconColor}
              title="Icon Menu Button"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              onClick={toggleOpen}
              style={cursorStyles}
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
            <Switch checked={checked} value={checked} onChange={toggleTheme} title="Theme Toggle Switch" />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

TopBar.defaultProps = {
  showPlayers: false,
};

export default React.memo(TopBar);
