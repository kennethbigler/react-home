import React from "react";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import menuItems from "./menu-items";

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

const Menu: React.FC<MenuProps> = React.memo(({ onItemClick }: MenuProps) => (
  <MenuList>
    <MenuItem onClick={() => onItemClick && onItemClick("/")}>
      Back to Resume
    </MenuItem>
    {menuItems.map((item, index) =>
      item.divider ? (
        <Divider key={index} />
      ) : (
        <MenuItem
          key={item.name}
          onClick={(): void =>
            onItemClick && onItemClick(`/games/${item.route || ""}`)
          }
        >
          {item.name}
        </MenuItem>
      )
    )}
  </MenuList>
));

export default Menu;
