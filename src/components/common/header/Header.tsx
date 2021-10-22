import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavigationClose from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import TopBar from './TopBar';
import useToggleState from '../../../hooks/useToggle';
import noop from '../../../apis/noop';

type ItemClick = (loc: string) => void;

export interface NavProps {
  onItemClick: ItemClick;
}

interface HeaderProps {
  /** content of the header bar via render props */
  children: (onItemClick: ItemClick) => React.ReactElement<NavProps>;
  /** callback function, wrapped with logic, then passed as onItemClick to children */
  handleNav?: (loc: string) => void;
  /** show/hide the player editor button */
  showPlayers?: boolean;
}

const Header = (props: HeaderProps): React.ReactElement => {
  const [isOpen, toggleOpen, setIsOpen] = useToggleState();
  const { palette: { mode }} = useTheme();
  const { children, handleNav = noop, showPlayers = false } = props;

  /** close the menu and call the passed callback */
  const handleNavigation = React.useCallback((loc: string): void => {
    setIsOpen(false);
    handleNav(loc);
  }, [handleNav, setIsOpen]);

  const iconColor = mode === 'light' ? 'inherit' : 'default';
  const fontColor = mode === 'light' ? 'inherit' : 'initial';

  return (
    <>
      <TopBar toggleOpen={toggleOpen} showPlayers={showPlayers} fontColor={fontColor} iconColor={iconColor} />
      <Drawer onClose={toggleOpen} open={isOpen}>
        <AppBar position="sticky">
          <Toolbar disableGutters>
            <IconButton
              aria-label="Menu Close"
              onClick={toggleOpen}
              color={iconColor}
              title="Close Side Menu"
              size="large"
            >
              <NavigationClose />
            </IconButton>
            <Typography variant="h6" color={fontColor}>
              Menu
            </Typography>
          </Toolbar>
        </AppBar>
        {children(handleNavigation)}
      </Drawer>
    </>
  );
};

export default Header;
