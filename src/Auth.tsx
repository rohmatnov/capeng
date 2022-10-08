import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useState } from "react";

declare let google: any;

const SCOPES = "openid profile https://www.googleapis.com/auth/spreadsheets";

interface AuthContextType {
  token: any;
  init: () => void;
  signin: (callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  set: (access?: string) => void;
}

let AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  let [token, setToken] = useState<string | undefined>(undefined);
  let auth: any;

  let init = () => {
    auth = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      ux_mode: "popup",
      callback: "",
    });

    if (Cookies.get("_token")) {
      setToken(Cookies.get("_token"));
    }
  };

  let signin = (callback: VoidFunction) => {
    auth.callback = async (res: any) => {
      if (res.error !== undefined) {
        throw res.error;
      }

      let expires: Date = new Date(
        new Date().getTime() + res?.expires_in * 1000
      );

      Cookies.set("_token", res?.access_token, {
        expires,
      });

      return callback();
    };

    if (!token) {
      auth.requestAccessToken({ prompt: "consent" });
    } else {
      auth.requestAccessToken({ prompt: "" });
    }
  };

  let signout = (callback: VoidFunction) => {
    setToken(undefined);
    google.accounts.oauth2.revoke(token);
    Cookies.remove("_token");
    return callback();
  };

  let set = (access?: string) => {
    setToken(access);
  };

  let value = { token, init, signin, signout, set };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
