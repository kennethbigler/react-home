import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid2";
import { Mission } from "../../../../constants/imperial-campaigns";

interface MissionProps {
  mission: Mission;
  onVictoryClick: () => void;
  onNameBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onRShopClick?: () => void;
  onEShopClick?: () => void;
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

const MissionEntry = ({
  mission: m,
  onVictoryClick,
  onNameBlur,
  onRShopClick,
  onEShopClick,
}: MissionProps) => (
  <>
    <Grid size={{ xs: 6, sm: 3 }}>
      <TextField
        label={`${getStoryType(m.isSide, !onRShopClick)} Mission`}
        color={
          getStoryType(m.isSide, !onRShopClick) === "Forced"
            ? "error"
            : undefined
        }
        variant="outlined"
        defaultValue={m.title}
        onBlur={onNameBlur}
      />
    </Grid>
    <Grid size={{ xs: 6, sm: 3 }}>
      <Chip
        avatar={<Avatar>{m.threat}</Avatar>}
        label="Threat"
        color={getVictoryColor(m.victory)}
        variant={m.victory > 0 ? undefined : "outlined"}
        onClick={onVictoryClick}
      />
    </Grid>
    {onRShopClick !== undefined && (
      <>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Chip
            label={`Tier ${m.shop} Items, Spend XP`}
            color={m.rShop ? "error" : undefined}
            variant={m.rShop ? undefined : "outlined"}
            onClick={onRShopClick}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Chip
            label="Agenda, Spend XP"
            color={m.eShop ? "primary" : undefined}
            variant={m.eShop ? undefined : "outlined"}
            onClick={onEShopClick}
          />
        </Grid>
      </>
    )}
  </>
);

export default MissionEntry;
