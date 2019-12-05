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

interface NavProps {
  onItemClick: (loc: string) => void;
}
interface HeaderProps {
  children: React.ReactElement<NavProps>;
  handleNav: Function;
  showPlayers?: boolean;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [isOpen, toggleOpen, setIsOpen] = useToggleState(false);
  const { palette: { type }} = useTheme();
  const { children, handleNav, showPlayers } = props;

  const handleNavigation = (loc: string): void => {
    setIsOpen(false);
    handleNav(loc);
  };

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
            >
              <NavigationClose />
            </IconButton>
            <Typography variant="h6" color={fontColor}>
              Menu
            </Typography>
          </Toolbar>
        </AppBar>
        {React.cloneElement(children, { onItemClick: handleNavigation })}
      </Drawer>
    </>
  );
};

Header.defaultProps = {
  showPlayers: false,
};

export default Header;
