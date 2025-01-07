import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import InfoPopup from "../../../common/info-popover/InfoPopup";

interface AddPenaltyProps {
  initials: string;
  onPenalty: (team: number) => () => void;
}

const AddPenalty = ({ initials, onPenalty }: AddPenaltyProps) => (
  <InfoPopup title="Penalty">
    <Grid container spacing={2}>
      <Grid size={6}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={onPenalty(0)}
        >
          Team {initials[0] + initials[2]}
        </Button>
      </Grid>
      <Grid size={6}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={onPenalty(1)}
        >
          Team {initials[1] + initials[3]}
        </Button>
      </Grid>
    </Grid>
  </InfoPopup>
);

export default AddPenalty;
