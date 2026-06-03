import { memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import menuItems from "./menu-items";
import { MenuList, MenuItem, Divider } from "@mui/material";

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

const Menu = memo(({ onItemClick }: MenuProps) => (
  <MenuList>
    <MenuItem
      component={RouterLink}
      onClick={() => onItemClick && onItemClick("/")}
      to="/"
    >
      Back to Resume
    </MenuItem>
    {menuItems.map((item, index) =>
      item.divider ? (
        <Divider key={index} aria-hidden />
      ) : (
        <MenuItem
          key={item.name}
          component={RouterLink}
          onClick={(): void =>
            onItemClick && onItemClick(`/games/${item.route || ""}`)
          }
          to={`/games/${item.route || ""}`}
        >
          {item.name}
        </MenuItem>
      ),
    )}
  </MenuList>
));

Menu.displayName = "Menu";

export default Menu;
