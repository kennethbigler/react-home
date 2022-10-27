import * as React from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import originalMenuItems, { MenuItem } from "./menu-items";

const menuItems = [...originalMenuItems];
const casinoItems = menuItems.splice(2, 5);
const gameItems = menuItems.splice(3, menuItems.length);

interface HomeProps {
  onItemClick?: (loc: string) => void;
}

const menuWrapperStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
};
const dividerStyles: React.CSSProperties = { marginTop: 60 };
const subHeaderStyles: React.CSSProperties = {
  textAlign: "left",
  marginBottom: 40,
};

const generateMenuItems =
  (onItemClick?: (loc: string) => void) =>
  ({ name, route, icon }: MenuItem) =>
    (
      <Card
        sx={{ width: 250, cursor: "pointer" }}
        key={name}
        onClick={(): void =>
          onItemClick && onItemClick(`/games/${route || ""}`)
        }
      >
        <CardContent>
          <Typography variant="h5" component="h4" textAlign="center">
            {name}
          </Typography>
          <Avatar style={{ margin: "auto", marginTop: 30, color: "white" }}>
            {icon}
          </Avatar>
        </CardContent>
      </Card>
    );

const Home: React.FC<HomeProps> = React.memo(({ onItemClick }: HomeProps) => (
  <div style={{ textAlign: "center", marginTop: 20 }}>
    <Typography variant="h2" component="h1">
      ReactJS Games
    </Typography>
    <Typography variant="h3" component="h2">
      This site was created to learn, check out the{" "}
      <Link
        href="https://github.com/kennethbigler/react-home"
        color="secondary"
      >
        <code>&lt;source&nbsp;code/&gt;</code>
      </Link>
    </Typography>
    <hr style={dividerStyles} />
    <Typography variant="h4" component="h3" style={subHeaderStyles}>
      Casino
    </Typography>
    <div style={menuWrapperStyles}>
      {casinoItems.map(generateMenuItems(onItemClick))}
    </div>
    <hr style={dividerStyles} />
    <Typography variant="h4" component="h3" style={subHeaderStyles}>
      Games
    </Typography>
    <div style={menuWrapperStyles}>
      {gameItems.map(generateMenuItems(onItemClick))}
    </div>
  </div>
));

export default Home;
