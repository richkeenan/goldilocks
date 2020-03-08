import auth0 from "auth0-js";

const AUTH0_DOMAIN = "dev-7jk4x0q6.eu.auth0.com";
const AUTH0_CLIENT_ID = "AyI1iAPgsHwKVKoQVkybDW8cMZzDbEaq";

// Adapted from https://swizec.com/blog/gatsby-auth0/swizec/8895
export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: "https://gold.richkeenan.com/auth0_callback",
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email"
  });

  login = () => {
    this.auth0.authorize();
  };

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user");
  };

  handleAuthentication = () => {
    if (typeof window !== "undefined") {
      // this must've been the trick
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
        } else if (err) {
          console.log(err);
        }

        // Return to the homepage after authentication.
        window.location.href = "/";
      });
    }
  };

  isAuthenticated = () => {
    const expiresAtStorage = localStorage.getItem("expires_at");
    if (!expiresAtStorage) return false;
    const expiresAt = JSON.parse(expiresAtStorage);
    return new Date().getTime() < expiresAt;
  };

  setSession = (authResult: auth0.Auth0DecodedHash) => {
    if (authResult.expiresIn && authResult.accessToken && authResult.idToken) {
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem("access_token", authResult.accessToken);
      localStorage.setItem("id_token", authResult.idToken);
      localStorage.setItem("expires_at", expiresAt);

      this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
        localStorage.setItem("user", JSON.stringify(user));
      });
    }
  };

  getUser = () => {
    const storageUser = localStorage.getItem("user");
    if (storageUser) {
      return JSON.parse(storageUser);
    }
  };

  getUserName = () => {
    if (this.getUser()) {
      return this.getUser().name;
    }
  };
}
