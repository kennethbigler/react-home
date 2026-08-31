import { memo } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { MenuList, MenuItem, Divider } from "@mui/material";
import NavMenuItems from "../common/NavMenuItems";
import menuItems from "./menu-items";

interface MenuProps {
  onItemClick?: () => void;
}

const Menu = memo(({ onItemClick }: MenuProps) => (
  <MenuList>
    <NavMenuItems items={menuItems} pathPrefix="/" onItemClick={onItemClick} />
    <Divider aria-hidden />
    <MenuItem
      component="a"
      href="https://github.com/kennethbigler/react-home"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub (opens in new tab)"
    >
      <GitHubIcon aria-hidden />
      &nbsp;GitHub&nbsp;
      <OpenInNewIcon fontSize="small" aria-hidden />
    </MenuItem>
    <MenuItem
      component="a"
      href="https://www.linkedin.com/in/kennethbigler"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn (opens in new tab)"
    >
      <LinkedInIcon aria-hidden />
      &nbsp;LinkedIn&nbsp;
      <OpenInNewIcon fontSize="small" aria-hidden />
    </MenuItem>
  </MenuList>
));

Menu.displayName = "Menu";

export default Menu;
