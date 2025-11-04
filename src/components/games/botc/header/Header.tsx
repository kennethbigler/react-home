import * as React from "react";
import Typography from "@mui/material/Typography";
import { playerDist } from "../../../../constants/botc";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import Controls from "./Controls";

interface HeaderProps {
  botcPlayers: BotCPlayer[];
  numPlayers: number;
  numTravelers: number;
  newBotCGame: () => void;
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginLeft: 40,
};

const Header = React.memo(
  ({ botcPlayers, numPlayers, numTravelers, newBotCGame }: HeaderProps) => {
    /* ----------     Render     ---------- */
    return (
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
            newBotCGame={newBotCGame}
          />
        </div>
      </div>
    );
  },
);

Header.displayName = "Header";

export default Header;
