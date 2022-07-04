import React from "react";
import { useRecoilState } from "recoil";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Switch from "@mui/material/Switch";
import SimplePopover from "./ButtonPopover";
import PlayerMenu from "./PlayerMenu";
import themeAtom, { darkTheme, lightTheme } from "../../../recoil/theme-atom";

const cursorStyles: React.CSSProperties = { cursor: "pointer" };
const flexLeftStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};
const flexRightStyles: React.CSSProperties = {
  display: "flex",
  marginRight: 15,
};
const spanTopStyles: React.CSSProperties = { left: 0, right: 0, top: 0 };

interface TopBarProps {
  /** change the color scheme of the icon */
  textColor: "inherit" | "primary" | "secondary" | "default" | undefined;
  /** show/hide the player editor button */
  showPlayers?: boolean;
  /** callback called onClick of Icon or Menu text */
  toggleOpen: React.MouseEventHandler;
}

const TopBar = (props: TopBarProps): React.ReactElement => {
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [checked, setChecked] = React.useState(theme.mode !== "dark");

  /** function toggle between site's light and dark theme */
  const toggleTheme = (): void => {
    checked ? setTheme(darkTheme) : setTheme(lightTheme);
    setChecked(!checked);
  };

  const { toggleOpen, showPlayers = false, textColor } = props;

  return (
    <AppBar style={spanTopStyles} className={`header-${theme.mode}-theme`}>
      <Toolbar disableGutters>
        <div className="flex-container">
          <div style={flexLeftStyles}>
            <IconButton
              aria-label="Menu"
              onClick={toggleOpen}
              color={textColor}
              title="Icon Menu Button"
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              onClick={toggleOpen}
              style={cursorStyles}
              variant="h6"
              color={textColor}
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
            <Switch
              checked={checked}
              value={checked}
              onChange={toggleTheme}
              title="Theme Toggle Switch"
              color="secondary"
            />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(TopBar);
