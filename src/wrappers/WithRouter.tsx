import { BrowserRouter } from "react-router-dom";
import Routes from "../components/Routes";

/** App class that wraps higher level components of the application */
const WithRouter = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);

export default WithRouter;
