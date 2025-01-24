import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import MissionEntry from "./MissionEntry";
import { useMissions } from "../useImperialAssault";

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
      <Typography variant="h3" gutterBottom>
        Missions
      </Typography>
      <Grid container alignItems="center" marginBottom={3} spacing={1}>
        {campaign.map((m, i) => {
          const isFinale = i >= campaign.length - 1;
          return (
            <MissionEntry
              key={i}
              mission={m}
              onVictoryClick={handleVictoryClick(i)}
              onNameChange={updateMissionName(i)}
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
