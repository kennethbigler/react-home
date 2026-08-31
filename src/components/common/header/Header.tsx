import { useState, useCallback, type ReactElement } from "react";
import NavigationClose from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import TopBar from "./TopBar";
import { AppBar, Toolbar, Drawer, IconButton, Typography } from "@mui/material";

export interface NavProps {
  onItemClick: () => void;
}

interface HeaderProps {
  /** drawer content via render props; receives a callback that closes the drawer */
  children: (onItemClick: () => void) => ReactElement<NavProps>;
}

const Header = ({ children }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const {
    palette: { mode },
  } = useTheme();

  const closeDrawer = useCallback(() => setIsOpen(false), []);

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
        {children(closeDrawer)}
      </Drawer>
    </>
  );
};

export default Header;
