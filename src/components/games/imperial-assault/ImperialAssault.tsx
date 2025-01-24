import Missions from "./missions/Missions";
import Empire from "./Empire";
import ForcedMissions from "./missions/ForcedMissions";
import Header from "./header/Header";
import Rebels from "./Rebels";

const ImperialAssault = () => (
  <>
    <Header />
    <Rebels />
    <Empire />
    <Missions />
    <ForcedMissions />
  </>
);

export default ImperialAssault;
