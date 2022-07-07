import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import menuItems from "./menu-items";

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

const Menu: React.FC<MenuProps> = React.memo(({ onItemClick }: MenuProps) => (
  <>
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
  </>
));

export default Menu;
