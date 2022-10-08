import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Auth";
import Error, { ErrorPage } from "../../Error";
import { useInfo } from "../../guards/Authenticated";

function CostIndex() {
  const { token, setTitle, setBack } = useInfo();
  const auth = useAuth();
  const [error, setError] = useState<ErrorPage>();
  const URL = `${import.meta.env.VITE_URL}/values/${
    import.meta.env.VITE_SHEET_TAB
  }!A2:D`;
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigate();

  const sheetApi = async () => {
    try {
      let { data } = await axios.get(URL, {
        params: { key: import.meta.env.VITE_GOOGLE_API_KEY },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRows(data?.values?.reverse() || []);
    } catch (error: any) {
      switch (error.response.status) {
        case 400:
        case 401:
          auth.signout(() => {
            navigation("/", { replace: true, state: "Invalid Token" });
          });
          break;
        case 403:
          setError({ status: 403, message: "Permission Denied" });
          break;
      }
    }
  };

  useEffect(() => {
    let didCancel = false;
    setTitle("Biaya");
    setBack("/client");

    if (token) {
      sheetApi();
    }

    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    if (refresh) {
      sheetApi();
      setRefresh(false);
    }
  }, [refresh]);

  const handleFormCreate = () => {
    navigation("/client/cost/create");
  };

  return error ? (
    <Error {...error} />
  ) : (
    <div>
      <div>
        <button
          className="bg-rose-500 rounded-lg px-6 py-2 text-sm text-rose-200 hover:text-rose-100 dark:hover:text-rose-100 active:ring active:ring-rose-200 dark:bg-rose-700 dark:active:ring-stone-800 font-semibold"
          onClick={handleFormCreate}
        >
          Tambah
        </button>
      </div>
      <div className="py-4">
        {rows.length ? (
          rows.map((row, index) => <List row={row} key={index} />)
        ) : (
          <NoRecord onClick={handleFormCreate} />
        )}
      </div>
      <Outlet context={{ token, setRefresh, rows }} />
    </div>
  );
}

export default CostIndex;

function List(props: any): JSX.Element {
  const { row } = props;
  const [open, setOpen] = useState<boolean>(false);
  const navigation = useNavigate();

  const dropdownRef: any = useRef(null);

  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
  });

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    navigation(`${e.target.dataset.row}/delete`);
    setOpen(false);
  };

  const handleUpdate = (e: any) => {
    e.preventDefault();
    navigation(`${e.target.dataset.row}/edit`);
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap px-4 py-3 border border-stone-100 dark:border-stone-800/50 rounded-lg mb-3 text-sm shadow dark:shadow-black/30 dark:text-stone-400">
      <div className="w-auto pr-4">
        <div className="font-semibold">{row[1]}</div>
        <small className="text-gray-500 dark:text-stone-500 text-xs">
          Tanggal
        </small>
      </div>
      <div className="flex-1 overflow-hidden text-right">
        <div className="flex flex-col">
          <div className="font-semibold">{row[2]}</div>
          <small className="text-gray-500 dark:text-stone-500 truncate text-xs">
            {row[3] || "-"}
          </small>
        </div>
      </div>
      <div className="pl-4 align-middle relative" ref={dropdownRef}>
        <button
          className="h-8 w-8 -mr-2 text-center rounded-full"
          onClick={handleClick}
          ref={setReferenceElement}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-three-dots inline-block"
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </button>
        {open && (
          <div
            className="absolute text-sm bg-white dark:bg-stone-800 rounded-lg z-10 py-2 min-w-[120px] border dark:border-stone-700 shadow dark:shadow-black/80 dark:text-stone-300"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <ul>
              <li>
                <Link
                  to="#"
                  className="px-4 py-2 block hover:bg-stone-100 dark:hover:bg-stone-700"
                  onClick={handleUpdate}
                  data-row={row[0]}
                  relative="route"
                >
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="px-4 py-2 block hover:bg-stone-100 dark:hover:bg-stone-700 text-red-500"
                  onClick={handleDelete}
                  data-row={row[0]}
                  relative="route"
                >
                  Hapus
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function NoRecord({ onClick }: { onClick: (e: any) => void }): JSX.Element {
  return (
    <div className="p-8 border rounded-lg dark:border-stone-800 dark:text-stone-400 text-center text-sm shadow">
      <h3 className="text-xl mb-1">Belum ada Record</h3>
      <div className="dark:text-stone-500 text-stone-600">
        Silakan klik tombol tambah untuk menambahkan record.
      </div>
      <div className="pt-4">
        <button
          className="bg-rose-500 rounded-full px-4 py-1.5 text-rose-200 hover:text-rose-100 dark:hover:text-rose-100 active:ring active:ring-rose-200 dark:bg-rose-700 dark:text-rose-300 dark:active:ring-stone-800 text-xs"
          onClick={onClick}
        >
          + Tambah
        </button>
      </div>
    </div>
  );
}
