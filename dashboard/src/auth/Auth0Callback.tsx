import { useEffect } from "react";
import { createAuthOptions, handleAuthentication } from "./util";

export const Auth0CallbackPage = () => {
  useEffect(() => {
    const auth = createAuthOptions();
    handleAuthentication(auth);
  }, []);

  return null;
};
