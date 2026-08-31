import { Link as RouterLink } from "react-router";
import { MenuItem, Divider } from "@mui/material";
import type { MenuItem as MenuItemEntry } from "./menu-types";

interface NavMenuItemsProps {
  items: MenuItemEntry[];
  /** prefix prepended to each item's route, e.g. "/" or "/games/" */
  pathPrefix: string;
  onItemClick?: () => void;
}

/** Menu entries for a section's drawer: router links with dividers between groups. */
const NavMenuItems = ({ items, pathPrefix, onItemClick }: NavMenuItemsProps) =>
  items.map((item, index) =>
    "divider" in item ? (
      <Divider key={index} aria-hidden />
    ) : (
      <MenuItem
        key={item.name}
        component={RouterLink}
        onClick={onItemClick}
        to={`${pathPrefix}${item.route || ""}`}
      >
        {item.name}
      </MenuItem>
    ),
  );

export default NavMenuItems;
