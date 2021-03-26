import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import NavigationClose from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
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
  handleNav: (loc: string) => void;
  /** show/hide the player editor button */
  showPlayers: boolean;
}

const Header = (props: HeaderProps): React.ReactElement => {
  const [isOpen, toggleOpen, setIsOpen] = useToggleState();
  const { palette: { type }} = useTheme();
  const { children, handleNav, showPlayers } = props;

  /** close the menu and call the passed callback */
  const handleNavigation = React.useCallback((loc: string): void => {
    setIsOpen(false);
    handleNav(loc);
  }, [handleNav, setIsOpen]);

  const iconColor = type === 'light' ? 'inherit' : 'default';
  const fontColor = type === 'light' ? 'inherit' : 'initial';

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

Header.defaultProps = {
  showPlayers: false,
  handleNav: noop,
};

export default Header;
