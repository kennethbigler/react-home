import * as React from "react";
import { useAtom } from "jotai";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Switch from "@mui/material/Switch";
import themeAtom, { darkTheme, lightTheme } from "../../../jotai/theme-atom";

const spanTopStyles: React.CSSProperties = { left: 0, right: 0, top: 0 };
const label = { inputProps: { "aria-label": "Theme Toggle Switch" } };

interface TopBarProps {
  /** change the color scheme of the icon */
  textColor: "inherit" | "primary" | "secondary" | "default" | undefined;
  /** callback called onClick of Icon or Menu text */
  toggleOpen: React.MouseEventHandler;
}

const TopBar = ({ toggleOpen, textColor }: TopBarProps) => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [isLight, setIsLight] = React.useState(theme.mode !== "dark");

  /** function toggle between site's light and dark theme */
  const toggleTheme = (): void => {
    if (isLight) {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
    setIsLight(!isLight);
  };

  return (
    <AppBar style={spanTopStyles} className={`header-${theme.mode}-theme`}>
      <Toolbar disableGutters>
        <div className="flex-container">
          <div style={{ alignItems: "center" }}>
            <IconButton
              aria-label="Menu"
              onClick={toggleOpen}
              color={textColor}
              title="Icon Menu Button"
              size="large"
            >
              <MenuIcon />
              <Typography variant="h6" color={textColor}>
                &nbsp;Menu
              </Typography>
            </IconButton>
          </div>
          <div style={{ marginRight: 15 }}>
            <Switch
              checked={isLight}
              value={isLight}
              onChange={toggleTheme}
              title={label.inputProps["aria-label"]}
              {...label}
              color="secondary"
            />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
