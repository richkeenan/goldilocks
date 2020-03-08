import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth0CallbackPage } from "./auth/Auth0Callback";
import Auth from "./auth/util";
import Dashboard from "./Dashboard";
const auth = new Auth();

const App = () => {
  const isAuthenticated = auth.isAuthenticated();

  return (
    <Router>
      <Switch>
        <Route path="/auth0_callback">
          <Auth0CallbackPage />
        </Route>
        <Route path="/">
          <Dashboard
            onLogin={() => auth.login()}
            isAuthenticated={isAuthenticated}
            onLogout={() => auth.logout()}
          />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
