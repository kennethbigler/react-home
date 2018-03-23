import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ResumeRoutes } from './resume/ResumeRoutes';
import { GameRoutes } from './games/GameRoutes';
// Parents: App

const styles = { page: { padding: '1em' } };

export const Main = () => {
  return (
    <main style={styles.page}>
      <Switch>
        <Route path="/games" component={GameRoutes} />
        <Route component={ResumeRoutes} />
      </Switch>
    </main>
  );
};
