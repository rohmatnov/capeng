import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";
import { User } from "../guards/Authenticated";

interface Dashboard {
  children: JSX.Element;
  user: User | null;
  title?: string;
  back?: string;
}

function DashboardLayout({
  children,
  user,
  title,
  back,
}: Dashboard): JSX.Element {
  const auth = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [themeMenu, setThemeMenu] = useState<boolean>(false);
  const dropdownRef: any = useRef(null);

  const handleLogout = (e: any) => {
    e.preventDefault();
    auth.signout(() => {
      navigate("/");
    });
  };

  const handleTheme = (e: any) => {
    e.preventDefault();
    setThemeMenu(true);
  };

  const handleBack = (e: any) => {
    e.preventDefault();
    setThemeMenu(false);
  };

  const handleChangeTheme = (str: any) => {
    setThemeMenu(false);
    setDropdownOpen(false);
  };

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (themeMenu) {
      setThemeMenu(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false);
        setThemeMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="lg:flex lg:flex-wrap dark:bg-stone-900 min-h-screen dark:text-stone-300">
      <aside className="lg:w-60 bg-stone-100 z-50 lg:min-h-screen fixed lg:static bottom-0 left-0 right-0 dark:bg-stone-800 dark:lg:border-r dark:lg:border-stone-700">
        <div className="p-4 hidden lg:block">Catet</div>
        <div className="text-sm">
          <Sidebar />
        </div>
      </aside>
      <main className="flex-1">
        <nav className="flex justify-between items-center py-3 px-4 lg:px-6">
          <div>
            <h1 className="font-semibold text-lg">
              {back && (
                <Link to={back}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-arrow-left inline-block border dark:border-stone-800 h-8 w-8 p-1.5 mr-3 rounded-md dark:hover:bg-stone-800"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                </Link>
              )}
              {title}
            </h1>
          </div>
          <div>
            <div className="text-sm relative" ref={dropdownRef}>
              <button className="flex items-center" onClick={handleDropdown}>
                <img
                  src={user?.picture}
                  alt={user?.name}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full inline-block"
                />
              </button>
              {dropdownOpen &&
                (themeMenu ? (
                  <SwitchTheme
                    back={handleBack}
                    changeTheme={handleChangeTheme}
                  />
                ) : (
                  <DropdownMenu theme={handleTheme} logout={handleLogout} />
                ))}
            </div>
          </div>
        </nav>
        <div className="px-4 pt-4 pb-10 lg:px-6 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;

function Sidebar(): JSX.Element {
  const base: string = `lg:my-1 lg:ml-3 lg:mr-2 lg:py-2 py-4 px-4 block font-medium relative text-center lg:text-left hover:lg:bg-stone-200 rounded-lg dark:text-stone-400 dark:hover:lg:bg-stone-900`;
  const active: string = `${base} lg:bg-stone-200 text-rose-600 before:lg:content-[''] before:lg:bg-rose-500 before:lg:absolute before:lg:top-0 before:lg:-left-3 before:lg:bottom-0 before:lg:w-1 before:lg:rounded-r-md animate-icon-scale lg:animate-none dark:text-rose-700 dark:before:lg:bg-rose-700 dark:lg:bg-stone-900`;

  return (
    <ul className="flex flex-wrap lg:block">
      <li className="w-1/2 lg:w-full">
        <NavLink
          className={({ isActive }) => (isActive ? active : base)}
          to="/client"
          end
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="h-6 w-6 lg:h-4 lg:w-4 mx-auto lg:ml-0 lg:mr-2 block lg:inline-block"
            viewBox="0 0 16 16"
          >
            <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
          </svg>
          <span className="hidden lg:inline-block">Dashboard</span>
        </NavLink>
      </li>
      <li className="w-1/2 lg:w-full">
        <NavLink
          className={({ isActive }) => (isActive ? active : base)}
          to="/client/cost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="h-6 w-6 lg:h-4 lg:w-4 mx-auto lg:ml-0 lg:mr-2 block lg:inline-block"
            viewBox="0 0 16 16"
          >
            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
          </svg>
          <span className="lg:inline-block hidden">Biaya</span>
        </NavLink>
      </li>
    </ul>
  );
}

interface DropdownInterface {
  theme: (e: any) => void;
  logout: (e: any) => void;
}

function DropdownMenu({ theme, logout }: DropdownInterface): JSX.Element {
  const isDarkTheme = localStorage.theme === "dark";
  const isDefaultTheme =
    !("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = isDarkTheme || isDefaultTheme;

  return (
    <div className="min-w-[160px] z-50  mt-2 absolute right-0 bg-white rounded-lg py-2 shadow-md border border-slate-200 dark:bg-stone-800 dark:border-stone-700 text-sm">
      <ul>
        <li className="py-px">
          <Link
            to="#"
            className="relative block py-2 px-4 hover:bg-stone-100 dark:hover:bg-stone-700 whitespace-nowrap"
            onClick={theme}
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-moon inline-block mr-2 -mt-0.5"
                viewBox="0 0 16 16"
              >
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-brightness-low-fill inline-block mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
              </svg>
            )}
            <span className="inline-block">Tampilan</span>
            <span className="inline-block absolute right-4 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-chevron-right inline-block ml-1 -mt-px h-3.5 w-3.5"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </span>
          </Link>
        </li>
        <li className="py-px">
          <Link
            to="#"
            className="relative block py-2 px-4 hover:bg-stone-100 dark:hover:bg-stone-700"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-box-arrow-right mr-2 inline-block"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
              />
            </svg>
            Keluar
          </Link>
        </li>
      </ul>
    </div>
  );
}

function SwitchTheme({
  back,
  changeTheme,
}: {
  back?: (e: any) => void;
  changeTheme: (str: any) => void;
}): JSX.Element {
  const active = (mode?: string) =>
    (localStorage.theme === mode && "text-rose-500") || "";

  const selected = (e: any) => {
    e.preventDefault();
    const mode = e.target.dataset.theme;
    if (["dark", "light"].includes(mode)) {
      localStorage.setItem("theme", mode);
    } else {
      localStorage.removeItem("theme");
    }
    changeMode();
    changeTheme(mode);
  };

  const changeMode = () => {
    const isTheme = localStorage.theme === "dark";
    const isDefaultTheme =
      !("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isTheme || isDefaultTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-w-[160px] z-50 mt-2 absolute right-0 bg-white rounded-lg py-2 shadow-md border border-stone-200 dark:bg-stone-800 dark:border-stone-700">
      <ul>
        <li className="py-px">
          <Link
            to="#"
            className="relative block py-2 px-4 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400"
            onClick={back}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left inline-block mr-2"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            Tampilan
          </Link>
        </li>
        <li className="border-b border-stone-200 my-2 dark:border-stone-700"></li>
        <li className="py-px">
          <Link
            to="#"
            className={`relative block py-2 px-4 hover:bg-stone-100 dark:hover:bg-stone-700 ${active(
              "light"
            )}`}
            onClick={selected}
            data-theme="light"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-brightness-low-fill inline-block mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
            </svg>
            Terang
          </Link>
        </li>
        <li className="py-px">
          <Link
            to="#"
            className={`relative block py-2 px-4 hover:bg-stone-100 dark:hover:bg-stone-700 ${active(
              "dark"
            )}`}
            onClick={selected}
            data-theme="dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-moon inline-block mr-2 -mt-0.5"
              viewBox="0 0 16 16"
            >
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
            </svg>
            Gelap
          </Link>
        </li>
        <li className="py-px">
          <Link
            to="#"
            className={`relative block py-2 px-4 hover:bg-stone-100 dark:hover:bg-stone-700 ${active()}`}
            onClick={selected}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-display inline-block mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z" />
            </svg>
            Sistem
          </Link>
        </li>
      </ul>
    </div>
  );
}
