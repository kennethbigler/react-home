import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Classes from "./pages/Classes";
import Projects from "./pages/Projects";

const styles = {
  page: {
    padding: "1em"
  }
};

const Main = () => {
  return (
    <div>
      <main style={styles.page}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route path="/work" component={Work} />
          <Route path="/classes" component={Classes} />
          <Route path="/projects" component={Projects} />
        </Switch>
      </main>
    </div>
  );
};

export default Main;
