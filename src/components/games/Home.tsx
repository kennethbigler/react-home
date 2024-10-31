import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import originalMenuItems from "./menu-items";
import HomeMenuItem from "./HomeMenuItem";

const menuItems = [...originalMenuItems];
const casinoItems = menuItems.splice(2, 5);
const gameItems = menuItems.splice(3, 5);
const socialItems = menuItems.splice(4, menuItems.length);

interface HomeProps {
  onItemClick?: (loc: string) => void;
}

const Home: React.FC<HomeProps> = React.memo(({ onItemClick }: HomeProps) => (
  <div style={{ textAlign: "center", marginTop: 20 }}>
    <Typography variant="h2" component="h1">
      Games
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
    <HomeMenuItem title="Casino" items={casinoItems} onClick={onItemClick} />
    <HomeMenuItem title="Games" items={gameItems} onClick={onItemClick} />
    <HomeMenuItem
      title="Social Deduction"
      items={socialItems}
      onClick={onItemClick}
    />
  </div>
));

Home.displayName = "GamesHome";

export default Home;
