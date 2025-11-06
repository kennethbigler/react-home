import { memo } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import {
  socialItems,
  trackerItems,
  casinoItems,
  gameItems,
} from "./menu-items";
import HomeMenuItem from "./HomeMenuItem";

interface HomeProps {
  onItemClick?: (loc: string) => void;
}

const Home = memo(({ onItemClick }: HomeProps) => (
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
    <HomeMenuItem title="Deduction" items={socialItems} onClick={onItemClick} />
    <HomeMenuItem title="Trackers" items={trackerItems} onClick={onItemClick} />
    <HomeMenuItem title="Casino" items={casinoItems} onClick={onItemClick} />
    <HomeMenuItem title="Games" items={gameItems} onClick={onItemClick} />
  </div>
));

Home.displayName = "GamesHome";

export default Home;
