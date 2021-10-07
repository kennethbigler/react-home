import React, { LazyExoticComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';

interface RouteShell {
  name: string;
  component: LazyExoticComponent<React.ComponentType>;
}

const routeMaker = (routes: RouteShell[], url: string): React.ReactNodeArray => routes.reduce(
  (acc: React.ReactNodeArray, obj) => {
    const { name, component } = obj;
    const path = `${url}${name}`;
    acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
    acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
    return acc;
  },
  [],
);

export default routeMaker;
