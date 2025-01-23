import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

const Rebels = () => {
  // TODO: move to jotai
  const [xp, setXP] = React.useState([0, 0, 0, 0]);
  const handleXPClick = (r: number, n: number) => () => {
    const newXP = [...xp];
    newXP[r] = n;
    setXP(newXP);
  };

  return (
    <>
      <div className="flex-container">
        <Typography variant="h3" gutterBottom>
          Rebels
        </Typography>
        <Typography>Rebel Credit Tracker</Typography>
      </div>
      <Grid container spacing={2} marginBottom={3}>
        {[0, 1, 2, 3].map((r) => (
          <Grid size={{ xs: 12, sm: 6 }} key={r}>
            <Typography>Rebel {r + 1}</Typography>
            <ButtonGroup aria-label={`Rebel ${r}'s experience`} fullWidth>
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <Button
                  key={`${r}-${n}`}
                  variant={xp[r] === n ? "contained" : "outlined"}
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
    </>
  );
};

export default Rebels;
