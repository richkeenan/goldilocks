import auth0 from "auth0-js";

const AUTH0_DOMAIN = "dev-7jk4x0q6.eu.auth0.com";
const AUTH0_CLIENT_ID = "AyI1iAPgsHwKVKoQVkybDW8cMZzDbEaq";

// Adapted from https://swizec.com/blog/gatsby-auth0/swizec/8895

export const createAuthOptions = () => {
  return new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    // redirectUri: "http://localhost:3000/auth0_callback",
    redirectUri: "https://gold.richkeenan.com/auth0_callback",
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email"
  });
};

export const login = (options: auth0.WebAuth) => {
  options.authorize();
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("user");
};

export const handleAuthentication = (options: auth0.WebAuth) => {
  if (typeof window !== "undefined") {
    // this must've been the trick
    options.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(options, authResult);
      } else if (err) {
        console.log(err);
      }

      // Return to the homepage after authentication.
      window.location.href = "/";
    });
  }
};

export const isAuthenticated = () => {
  const expiresAtStorage = localStorage.getItem("expires_at");
  if (!expiresAtStorage) return false;
  const expiresAt = JSON.parse(expiresAtStorage);
  return new Date().getTime() < expiresAt;
};

const setSession = (
  options: auth0.WebAuth,
  authResult: auth0.Auth0DecodedHash
) => {
  if (authResult.expiresIn && authResult.accessToken && authResult.idToken) {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);

    options.client.userInfo(authResult.accessToken, (err, user) => {
      localStorage.setItem("user", JSON.stringify(user));
    });
  }
};

export const getUser = () => {
  const storageUser = localStorage.getItem("user");
  if (storageUser) {
    return JSON.parse(storageUser);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};
