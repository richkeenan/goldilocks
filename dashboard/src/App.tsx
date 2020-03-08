import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth0CallbackPage } from "./auth/Auth0Callback";
import Dashboard from "./Dashboard";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/auth0_callback">
          <Auth0CallbackPage />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
