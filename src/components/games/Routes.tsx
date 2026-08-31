import SectionRoutes from "../common/SectionRoutes";
import Menu from "./Menu";
import { gameRoutes } from "./menu-items";

const GameRoutes = () => (
  <SectionRoutes Menu={Menu} routes={gameRoutes} fallbackTo="/games" />
);

export default GameRoutes;
