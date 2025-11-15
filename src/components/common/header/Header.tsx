import { useState, useCallback, ReactElement } from "react";
import NavigationClose from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import TopBar from "./TopBar";
import { AppBar, Toolbar, Drawer, IconButton, Typography } from "@mui/material";

type ItemClick = (loc: string) => void;

export interface NavProps {
  onItemClick: ItemClick;
}

interface HeaderProps {
  /** content of the header bar via render props */
  children: (onItemClick: ItemClick) => ReactElement<NavProps>;
  /** callback function, wrapped with logic, then passed as onItemClick to children */
  handleNav?: (loc: string) => void;
}

const Header = ({ children, handleNav }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const {
    palette: { mode },
  } = useTheme();

  /** close the menu and call the passed callback */
  const handleNavigation = useCallback(
    (loc: string): void => {
      setIsOpen(false);
      if (handleNav) {
        handleNav(loc);
      }
    },
    [handleNav, setIsOpen],
  );

  const textColor = mode === "light" ? "inherit" : "default";

  return (
    <>
      <TopBar toggleOpen={toggleOpen} textColor={textColor} />
      <Drawer onClose={toggleOpen} open={isOpen}>
        <AppBar position="sticky">
          <Toolbar disableGutters>
            <IconButton
              aria-label="Menu Close"
              onClick={toggleOpen}
              color={textColor}
              title="Close Side Menu"
              size="large"
            >
              <NavigationClose />
            </IconButton>
            <Typography variant="h6" color={textColor}>
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
