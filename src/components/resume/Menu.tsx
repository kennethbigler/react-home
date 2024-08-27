import * as React from "react";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import noop from "../../apis/noop";

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
const stackOverflow = (): void => {
  window.open("https://stackoverflow.com/users/4830309/ken-bigler");
};

const Menu: React.FC<MenuProps> = React.memo((props: MenuProps) => {
  const { onItemClick } = props;
  // internal routes
  const menu = React.useMemo(
    () =>
      [
        { name: "Summary", route: "" },
        { name: "Work", route: "work" },
        { name: "Resume", route: "resume" },
        { name: "Education", route: "education" },
        { name: "Presentations", route: "presentations" },
        { name: "Comp Calculator", route: "comp" },
        { divider: true },
        { name: "Cars", route: "cars" },
        { name: "Travel Map", route: "travel" },
        { divider: true },
        { name: "Games", route: "games" },
      ].map((item, index) =>
        item.divider ? (
          <Divider key={index} />
        ) : (
          <MenuItem
            key={item.name}
            onClick={(): void =>
              onItemClick ? onItemClick(`/${item.route || ""}`) : noop()
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
      <Divider />
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
      <Divider />
      <br />
      <MenuItem onClick={stackOverflow} sx={{ padding: "6px" }}>
        <img
          alt="profile for Ken Bigler at Stack Overflow, Q&A for professional and enthusiast programmers"
          id="stackOverflow"
          src="https://stackoverflow.com/users/flair/4830309.png?theme=dark"
          style={{
            display: "block",
            margin: "auto",
            cursor: "pointer",
            width: 142,
          }}
        />
      </MenuItem>
    </MenuList>
  );
});

Menu.displayName = "Menu";

export default Menu;
