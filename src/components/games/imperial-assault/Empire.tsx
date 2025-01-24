import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useEmpire } from "./useImperialAssault";

const xpOptions = [0, 1, 2, 3, 4, 5, 6];

const Empire = () => {
  const { xp, influence, handleXPClick, handleInfluenceClick } = useEmpire();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Empire
      </Typography>
      <Grid container spacing={2} marginBottom={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography>XP</Typography>
          <ButtonGroup aria-label="Empire experience level" fullWidth>
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
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
      </Grid>
    </>
  );
};

export default Empire;
