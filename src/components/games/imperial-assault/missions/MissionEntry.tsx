import { Mission } from "../../../../constants/imperial-campaigns";
import { TextField, Chip, Avatar, Grid, Divider } from "@mui/material";

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

const STORY = "Story Mission";
const SIDE = "Side Mission";
const FINALE = "Finale";
const FORCED = "Forced Mission (p.31)";

const getStoryType = (isSide: boolean, isForced: boolean) => {
  if (!isForced) {
    return isSide ? SIDE : STORY;
  }
  return isSide ? FORCED : FINALE;
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
        label={getStoryType(m.isSide, !onRShopClick)}
        color={
          getStoryType(m.isSide, !onRShopClick) === FORCED ? "error" : undefined
        }
        variant="outlined"
        value={m.title}
        onChange={onNameBlur}
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
            label={`Tier ${m.shop} Items (${m.shop.length > 1 ? "7 & 7" : 14}), Spend XP`}
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
        <Grid size={12}>
          <Divider aria-hidden />
        </Grid>
      </>
    )}
  </>
);

export default MissionEntry;
