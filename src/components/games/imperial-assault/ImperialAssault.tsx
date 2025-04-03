import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Missions from "./missions/Missions";
import Empire from "./Empire";
import ForcedMissions from "./missions/ForcedMissions";
import Header from "./header/Header";
import Rebels from "./Rebels";
import TierLists from "./TierLists";

const ImperialAssault = () => (
  <>
    <Header />

    <Grid container spacing={2}>
      <Rebels />
      <Empire />
    </Grid>

    <Divider aria-hidden />

    <Missions />
    <ForcedMissions />

    <Divider aria-hidden />

    <TierLists />
  </>
);

export default ImperialAssault;
