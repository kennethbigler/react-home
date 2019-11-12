import React from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from '../components/Routes';

/** App class that wraps higher level components of the application */
const WithRouter: React.FC<{}> = () => (
  <HashRouter>
    <Routes />
  </HashRouter>
);

export default WithRouter;
