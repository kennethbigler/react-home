import { memo, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { MenuList, MenuItem, Divider } from "@mui/material";
import menuItems from "./menu-items";

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

const Menu = memo(({ onItemClick }: MenuProps) => {
  // internal routes
  const menu = useMemo(
    () =>
      menuItems.map((item, index) =>
        item.divider ? (
          <Divider key={index} aria-hidden />
        ) : (
          <MenuItem
            key={item.name}
            component={RouterLink}
            onClick={(): void =>
              onItemClick && onItemClick(`/${item.route || ""}`)
            }
            to={`/${item.route || ""}`}
          >
            {item.name}
          </MenuItem>
        ),
      ),
    [onItemClick],
  );

  return (
    <MenuList>
      {menu}
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
  );
});

Menu.displayName = "Menu";

export default Menu;
