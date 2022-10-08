import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

function CostDelete(): JSX.Element {
  const { row } = useParams();
  const {
    token,
    setRefresh,
    rows,
  }: { token: string; setRefresh: any; rows: any } = useOutletContext();

  const navigation = useNavigate();
  const URL = `${import.meta.env.VITE_URL}:batchUpdate`;
  const [loading, setLoading] = useState(false);
  const [errorPage, setErrorPage] = useState(false);

  useEffect(() => {
    const data = rows.find((val: any) => val[0] == row);
    if (!data) {
      setErrorPage(true);
    }
    document.documentElement.classList.add("overflow-hidden");
  }, []);

  const close = () => {
    navigation("/client/cost", { relative: "route" });
    document.documentElement.classList.remove("overflow-hidden");
  };

  const confirm = () => {
    axios
      .post(
        URL,
        {
          requests: {
            deleteDimension: {
              range: {
                dimension: "ROWS",
                sheetId: 0,
                startIndex: parseInt(row || "0"),
                endIndex: parseInt(row || "0") + 1,
              },
            },
          },
        },
        {
          params: {
            key: import.meta.env.VITE_GOOGLE_API_KEY,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res: any) => {
        close();
        setRefresh(true);
      })
      .catch((err) => {
        if ([400, 401].includes(err.response.status)) {
          Cookies.remove("_token");
          navigation("/", { replace: true, state: "Invalid Token" });
          return;
        }
      })
      .then(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-stone-600/50 z-50">
      <div className="max-w-xs bg-white dark:bg-stone-900 w-full rounded-lg shadow-lg dark:shadow-black/50 border border-slate-200 dark:border-stone-800">
        {errorPage ? (
          <>
            <div className="border-b dark:border-stone-800 px-4 py-3 flex justify-between">
              <h3>Kesalahan</h3>
              <button className="w-8 h-8 text-xl -mt-1.5 -mr-2" onClick={close}>
                &times;
              </button>
            </div>
            <div className="p-4 text-sm dark:text-stone-400">
              Data dengan row id <span className="text-rose-500">{row}</span>{" "}
              tidak ditemukan.
            </div>
          </>
        ) : (
          <>
            <div className="border-b dark:border-stone-800 px-4 py-3 flex justify-between">
              <h3>Konfirmasi Hapus</h3>
              <button className="w-8 h-8 text-xl -mt-1.5 -mr-2" onClick={close}>
                &times;
              </button>
            </div>
            <div className="p-4 text-sm dark:text-stone-400">
              Apakah anda ingin menghapus data ini?
            </div>
            <div className="flex justify-between items-stretch p-4 text-sm -mx-2">
              <div className="w-1/2 px-2">
                <button
                  className="w-full py-2 px-4 rounded-lg dark:bg-stone-800 dark:text-stone-300 focus:outline-none active:ring dark:active:ring-stone-700 dark:active:ring-opacity-40 bg-stone-100 active:ring-stone-200 dark:hover:text-stone-200 hover:text-stone-500"
                  onClick={close}
                >
                  Batal
                </button>
              </div>
              <div className="w-1/2 px-2">
                <button
                  className="w-full bg-red-500 rounded-lg px-6 py-2 text-red-100 hover:text-red-100 dark:hover:text-red-100 active:ring active:ring-red-200 dark:bg-red-700 dark:text-red-200 dark:active:ring-stone-800"
                  onClick={confirm}
                  disabled={loading}
                >
                  {loading && (
                    <svg
                      className="animate-spin -ml-1 -mt-1 mr-3 h-5 w-5 text-white inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Hapus
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default CostDelete;
