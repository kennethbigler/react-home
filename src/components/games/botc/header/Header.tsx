import * as React from "react";
import Typography from "@mui/material/Typography";
import { playerDist } from "../../../../constants/botc";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import Controls from "./Controls";

interface HeaderProps {
  botcPlayers: BotCPlayer[];
  numPlayers: number;
  numTravelers: number;
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginLeft: 40,
};

const Header = ({ botcPlayers, numPlayers, numTravelers }: HeaderProps) => (
  <div className="flex-container">
    <Typography variant="h2" component="h1">
      BotC
    </Typography>

    <div style={headerStyle}>
      <div style={{ textAlign: "center" }}>
        <Typography>
          {playerDist[numPlayers]}
          {numTravelers ? ` + ${numTravelers}` : ""}
        </Typography>
      </div>

      <Controls
        botcPlayers={botcPlayers}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
      />
    </div>
  </div>
);

export default Header;
