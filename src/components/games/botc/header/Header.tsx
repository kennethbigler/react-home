import { CSSProperties } from "react";
import { playerDist } from "../../../../constants/botc";
import Controls from "./Controls";
import { Typography } from "@mui/material";

interface HeaderProps {
  numPlayers: number;
  numTravelers: number;
}

const headerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginLeft: 40,
};

const Header = ({ numPlayers, numTravelers }: HeaderProps) => (
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

      <Controls numPlayers={numPlayers} numTravelers={numTravelers} />
    </div>
  </div>
);

export default Header;
