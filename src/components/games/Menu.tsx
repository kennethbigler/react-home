import { memo } from "react";
import menuItems from "./menu-items";
import { MenuList, MenuItem, Divider } from "@mui/material";

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

const Menu = memo(({ onItemClick }: MenuProps) => (
  <MenuList>
    <MenuItem onClick={() => onItemClick && onItemClick("/")}>
      Back to Resume
    </MenuItem>
    {menuItems.map((item, index) =>
      item.divider ? (
        <Divider key={index} aria-hidden />
      ) : (
        <MenuItem
          key={item.name}
          onClick={(): void =>
            onItemClick && onItemClick(`/games/${item.route || ""}`)
          }
        >
          {item.name}
        </MenuItem>
      ),
    )}
  </MenuList>
));

Menu.displayName = "Menu";

export default Menu;
