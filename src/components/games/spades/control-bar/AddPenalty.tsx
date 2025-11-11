import InfoPopup from "../../../common/info-popover/InfoPopup";
import { Button, Grid } from "@mui/material";

interface AddPenaltyProps {
  initials: string;
  onPenalty: (team: number) => () => void;
}

const AddPenalty = ({ initials, onPenalty }: AddPenaltyProps) => (
  <InfoPopup title="Penalty" buttonVariant="outlined" buttonColor="error">
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
