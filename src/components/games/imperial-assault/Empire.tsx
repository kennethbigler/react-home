import { useEmpire } from "./useImperialAssault";
import { Button, ButtonGroup, Grid, Typography } from "@mui/material";

const xpOptions = [0, 1, 2, 3, 4, 5, 6];

const Empire = () => {
  const { xp, influence, handleXPClick, handleInfluenceClick } = useEmpire();

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Typography variant="h3" gutterBottom>
        Empire
      </Typography>
      <Typography>XP</Typography>
      <ButtonGroup
        aria-label="Empire experience level"
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        {xpOptions.map((n) => (
          <Button
            key={n}
            variant={xp === n ? "contained" : "outlined"}
            onClick={handleXPClick(n)}
            aria-label={`${n} experience`}
          >
            {n}
          </Button>
        ))}
      </ButtonGroup>
      <Typography>Influence</Typography>
      <ButtonGroup aria-label="Empire influence level" fullWidth>
        {xpOptions.map((n) => (
          <Button
            key={n}
            variant={influence === n ? "contained" : "outlined"}
            onClick={handleInfluenceClick(n)}
            aria-label={`${n} influence`}
          >
            {n}
          </Button>
        ))}
      </ButtonGroup>
    </Grid>
  );
};

export default Empire;
