import { useEffect } from "react";
import Auth from "./util";

export const Auth0CallbackPage = () => {
  useEffect(() => {
    const auth = new Auth();
    auth.handleAuthentication();
  }, []);

  return null;
};
