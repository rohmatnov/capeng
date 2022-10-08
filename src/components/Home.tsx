import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

function Home(): JSX.Element {
  const auth = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const navigation = useNavigate();

  useEffect(() => {
    auth.init();
    if (location.state) {
      setOpen(true);
    }
  }, []);

  const handleClick = () => {
    auth.signin(() => {
      navigation("/client", { replace: true });
    });
  };

  const handleClose = () => {
    setOpen(false);
    navigation("/", { replace: true });
  };

  return Cookies.get("_token") ? (
    <Navigate to="client" state={{ from: location }} replace />
  ) : (
    <div className="flex min-h-screen items-center justify-center dark:bg-stone-900 dark:text-stone-300">
      <button
        className="inline-flex items-center text-lg bg-stone-100 px-4 py-2 shadow rounded-lg hover:bg-stone-200 active:ring active:ring-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-google mr-2 h-5"
          viewBox="0 0 16 16"
        >
          <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
        </svg>
        <span className="font-semibold">Google</span>
      </button>
      {open ? (
        <ErrorToken
          message={location.state}
          signin={handleClick}
          close={handleClose}
        />
      ) : null}
    </div>
  );
}

interface ErrorInterface {
  message?: string;
  close?: VoidFunction;
  signin?: VoidFunction;
}

function ErrorToken({ message, close, signin }: ErrorInterface) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-stone-900 bg-opacity-25 flex items-center justify-center">
      <div className="bg-white max-w-xs w-full rounded-lg shadow-lg dark:bg-stone-800 dark:border dark:border-stone-700">
        <div className="p-4 text-center text-sm relative">
          <button
            className="text-3xl absolute top-2 right-2 w-10 h-10 p-0 rounded-full focus:outline-none dark:text-stone-400 dark:hover:text-stone-200"
            onClick={close}
          >
            <span className="inline-block">&times;</span>
          </button>
          <div className="my-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-shield-lock-fill w-16 h-16 text-rose-500 mx-auto dark:text-rose-800"
              viewBox="0 0 16 16"
            >
              <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
              <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold">{message}</h3>
          <div className="text-stone-600 mb-4 dark:text-stone-400">
            Terjadi kesalahan dalam autentikasi. silakan ulangi
          </div>
          <div className="mb-4">
            <button
              className="bg-rose-500 text-white px-4 py-1.5 rounded-full active:ring active:ring-rose-300 focus:outline-none dark:bg-rose-800 dark:text-rose-200 dark:active:ring-stone-700"
              onClick={signin}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
