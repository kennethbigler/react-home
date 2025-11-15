import MissionEntry from "./MissionEntry";
import { useMissions } from "../useImperialAssault";
import { Grid, Typography } from "@mui/material";

const Missions = () => {
  const {
    campaign,
    handleEShopClick,
    handleRShopClick,
    handleVictoryClick,
    updateMissionName,
  } = useMissions();

  return (
    <>
      <Typography variant="h3">Missions</Typography>
      <Grid container alignItems="center" marginBottom={3} spacing={1}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography>Mission (p.44, 57)</Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography>Threat Level (p.46)</Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography>Rebel Upgrade (p.52)</Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography>Imperial Upgrade (p.35)</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" marginBottom={3} spacing={1}>
        {campaign.map((m, i) => {
          const isFinale = i >= campaign.length - 1;
          return (
            <MissionEntry
              key={i}
              mission={m}
              onNameBlur={updateMissionName(i)}
              onVictoryClick={handleVictoryClick(i)}
              onEShopClick={isFinale ? undefined : handleEShopClick(i)}
              onRShopClick={isFinale ? undefined : handleRShopClick(i)}
            />
          );
        })}
      </Grid>
    </>
  );
};

export default Missions;
