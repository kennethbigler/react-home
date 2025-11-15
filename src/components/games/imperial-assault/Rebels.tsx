import { useRebels } from "./useImperialAssault";
import {
  Button,
  ButtonGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const players = [0, 1, 2, 3];
const maxXP = [0, 1, 2, 3, 4, 5, 6];

const Rebels = () => {
  const { rebelXP, credits, handleXPClick, updateCredits } = useRebels();

  return (
    <Grid size={{ xs: 12, md: 8 }}>
      <div className="flex-container">
        <Typography variant="h3" gutterBottom>
          Rebels
        </Typography>
        <TextField
          label="CREDITS"
          color="error"
          slotProps={{ input: { startAdornment: "ᖬ" } }}
          value={credits}
          onChange={updateCredits}
          onBlur={updateCredits}
        />
      </div>
      <Grid container spacing={2} marginBottom={3}>
        {players.map((r) => (
          <Grid size={{ xs: 12, sm: 6 }} key={r}>
            <Typography>Rebel {r + 1}</Typography>
            <ButtonGroup
              aria-label={`Rebel ${r}'s experience`}
              fullWidth
              color="error"
            >
              {maxXP.map((n) => (
                <Button
                  key={`${r}-${n}`}
                  variant={rebelXP[r] === n ? "contained" : "outlined"}
                  onClick={handleXPClick(r, n)}
                  aria-label={`${n} experience`}
                >
                  {n}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Rebels;
