import { HashRouter } from "react-router-dom";
import Routes from "../components/Routes";

/** App class that wraps higher level components of the application */
const WithRouter = () => (
  <HashRouter>
    <Routes />
  </HashRouter>
);

export default WithRouter;
