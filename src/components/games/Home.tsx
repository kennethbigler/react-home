import { memo } from "react";
import {
  socialItems,
  trackerItems,
  casinoItems,
  gameItems,
} from "./menu-items";
import HomeMenuItem from "./HomeMenuItem";
import { Typography, Link } from "@mui/material";

const Home = memo(() => (
  <div style={{ textAlign: "center", marginTop: 20 }}>
    <Typography variant="h2" component="h1">
      Games
    </Typography>
    <Typography variant="h3" component="h2">
      This site was created to learn, check out the{" "}
      <Link
        href="https://github.com/kennethbigler/react-home"
        sx={{ color: "text.primary" }}
      >
        <code>&lt;source&nbsp;code/&gt;</code>
      </Link>
    </Typography>
    <HomeMenuItem title="Deduction" items={socialItems} />
    <HomeMenuItem title="Trackers" items={trackerItems} />
    <HomeMenuItem title="Casino" items={casinoItems} />
    <HomeMenuItem title="Games" items={gameItems} />
  </div>
));

Home.displayName = "GamesHome";

export default Home;
