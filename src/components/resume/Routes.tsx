import SectionRoutes from "../common/SectionRoutes";
import Menu from "./Menu";
import { resumeRoutes } from "./menu-items";

const ResumeRoutes = () => (
  <SectionRoutes Menu={Menu} routes={resumeRoutes} fallbackTo="/" />
);

export default ResumeRoutes;
