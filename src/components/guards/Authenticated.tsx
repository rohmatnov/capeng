import axios from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useAuth } from "../../Auth";
import Error, { ErrorPage } from "../Error";
import DashboardLayout from "../layouts/DashboardLayout";

export interface User {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

type InfoContext = {
  user: User | null;
  token: string | null;
  title: string | undefined;
  setTitle: Dispatch<SetStateAction<string | undefined>>;
};
export function useInfo(): InfoContext {
  return useOutletContext<InfoContext>();
}

function Authenticated(): JSX.Element {
  const location = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();
  const access_token: string | undefined = Cookies.get("_token");
  const [error, setError] = useState<ErrorPage>({});
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState<string | undefined>();
  const URL = "https://openidconnect.googleapis.com/v1/userinfo";

  useEffect(() => {
    auth.init();
    const info = async () => {
      try {
        let response = await axios.get(URL, {
          params: {
            access_token,
          },
        });
        setUser(response.data);
      } catch (error: any) {
        switch (error.response.status) {
          case 400:
          case 401:
            auth.set(undefined);
            Cookies.remove("_token");
            navigate("/", { replace: true, state: "Invalid Token" });
            break;
          case 403:
            setError({ status: 403, message: "Bad Permission" });
            break;
        }
      }
    };
    info();
  }, []);

  useEffect(() => {
    if (!access_token) {
      auth.set(access_token);
      navigate("/", { state: "Invalid Token", replace: true });
    }
  }, [location.pathname]);

  return access_token ? (
    <DashboardLayout user={user} title={title}>
      <Outlet context={{ user, token: access_token, title, setTitle }} />
    </DashboardLayout>
  ) : (
    <Error {...error} />
  );
}

export default Authenticated;
