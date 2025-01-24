import * as React from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid2";
import { Mission } from "../../../../constants/imperial-campaigns";

interface MissionProps {
  mission: Mission;
  isForced: boolean;
}

const getVictoryColor = (v: number) => {
  switch (v) {
    case 0:
      return;
    case 1:
      return "error";
    case 2:
    default:
      return "primary";
  }
};

const getStoryType = (isSide: boolean, isForced: boolean) => {
  if (!isForced) {
    return isSide ? "Side" : "Story";
  }
  return isSide ? "Forced" : "Finale";
};

const MissionEntry = ({ mission: m, isForced }: MissionProps) => {
  // TODO: replace these w/ persistent storage
  const [rShop, setRShop] = React.useState(false);
  const handleRShopClick = () => setRShop(!rShop);

  const [eShop, setEShop] = React.useState(false);
  const handleEShopClick = () => setEShop(!eShop);

  const [victory, setVictory] = React.useState(0);
  const handleVictoryClick = () => setVictory((victory + 1) % 3);

  const storyType = getStoryType(m.isSide, isForced);

  return (
    <>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label={`${storyType} Mission`}
          color={storyType === "Forced" ? "error" : undefined}
          variant="outlined"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Chip
          avatar={<Avatar>{m.threat}</Avatar>}
          label="Threat"
          color={getVictoryColor(victory)}
          variant={victory > 0 ? undefined : "outlined"}
          onClick={handleVictoryClick}
        />
      </Grid>
      {!isForced && (
        <>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Chip
              label={`Tier ${m.shop} Items, Spend XP`}
              color={rShop ? "error" : undefined}
              variant={rShop ? undefined : "outlined"}
              onClick={handleRShopClick}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Chip
              label="Agenda, Spend XP"
              color={eShop ? "primary" : undefined}
              variant={eShop ? undefined : "outlined"}
              onClick={handleEShopClick}
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default MissionEntry;
