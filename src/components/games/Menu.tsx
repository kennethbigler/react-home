import { memo } from "react";
import { Link as RouterLink } from "react-router";
import { MenuList, MenuItem } from "@mui/material";
import NavMenuItems from "../common/NavMenuItems";
import menuItems from "./menu-items";

interface MenuProps {
  onItemClick?: () => void;
}

const Menu = memo(({ onItemClick }: MenuProps) => (
  <MenuList>
    <MenuItem component={RouterLink} onClick={onItemClick} to="/">
      Back to Resume
    </MenuItem>
    <NavMenuItems
      items={menuItems}
      pathPrefix="/games/"
      onItemClick={onItemClick}
    />
  </MenuList>
));

Menu.displayName = "Menu";

export default Menu;
