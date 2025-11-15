import { memo, useMemo } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { MenuList, MenuItem, Divider } from "@mui/material";

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

// external links
const github = (): void => {
  window.open("https://github.com/kennethbigler/react-home");
};
const linkedIn = (): void => {
  window.open("https://www.linkedin.com/in/kennethbigler");
};

const Menu = memo(({ onItemClick }: MenuProps) => {
  // internal routes
  const menu = useMemo(
    () =>
      [
        { name: "Summary", route: "" },
        { name: "Work", route: "work" },
        { name: "Resume", route: "resume" },
        { name: "Education", route: "education" },
        { name: "Presentations", route: "presentations" },
        { name: "Comp Calculator", route: "comp" },
        { divider: true },
        { name: "F1", route: "f1" },
        { name: "Cars", route: "cars" },
        { name: "Travel Map", route: "travel" },
        { divider: true },
        { name: "Games", route: "games" },
      ].map((item, index) =>
        item.divider ? (
          <Divider key={index} aria-hidden />
        ) : (
          <MenuItem
            key={item.name}
            onClick={(): void =>
              onItemClick && onItemClick(`/${item.route || ""}`)
            }
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
      <MenuItem onClick={github}>
        <GitHubIcon />
        &nbsp;GitHub&nbsp;
        <OpenInNewIcon fontSize="small" />
      </MenuItem>
      <MenuItem onClick={linkedIn}>
        <LinkedInIcon />
        &nbsp;LinkedIn&nbsp;
        <OpenInNewIcon fontSize="small" />
      </MenuItem>
    </MenuList>
  );
});

Menu.displayName = "Menu";

export default Menu;
