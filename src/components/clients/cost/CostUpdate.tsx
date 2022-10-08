import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

interface ErrorMessage {
  date?: string;
  amount?: string;
  description?: string;
}

function CostUpdate() {
  const { row } = useParams();
  const {
    token,
    setRefresh,
    rows,
  }: { token: string; setRefresh: any; rows: any } = useOutletContext();

  const navigation = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const range = `C${parseInt(row || "0") + 1}:D${parseInt(row || "0") + 1}`;
  const URL = `${import.meta.env.VITE_URL}/values/${
    import.meta.env.VITE_SHEET_TAB
  }!${range}`;

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState<string>("");

  const [errors, setErrors] = useState<ErrorMessage>({});
  const [errorPage, setErrorPage] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");
    const data = rows.find((val: any) => val[0] == row);
    if (!data) {
      setErrorPage(true);
      return;
    }
    const current = moment(data[1], "DD/MM/YYYY").format("YYYY-MM-DD");
    setDate(current);
    setAmount(data[2].replace(/[^0-9]+/gi, ""));
    setDescription(data[3]);
  }, []);

  const close = () => {
    navigation("/client/cost");
    document.documentElement.classList.remove("overflow-hidden");
  };

  const handleAmount = (e: any) => {
    setAmount(e.target.value);
    validateAmount(e.target.value);
  };

  const validateAmount = (value: number): boolean => {
    if (value < 100 || value > 1000000000) {
      const error = { amount: "Jumlah antara 100 - 1.000.000.000" };
      setErrors({ ...errors, ...error });
      return true;
    }

    const error = { amount: undefined };
    setErrors({ ...errors, ...error });
    return false;
  };

  const handleDescription = (e: any) => {
    setDescription(e.target.value);
    return;
  };

  const handleSubmit = () => {
    if (!validateAmount(amount)) {
      setLoading(true);
      axios
        .put(
          URL,
          {
            majorDimension: "ROWS",
            range: `${import.meta.env.VITE_SHEET_TAB}!${range}`,
            values: [[amount, description]],
          },
          {
            params: {
              key: import.meta.env.VITE_GOOGLE_API_KEY,
              valueInputOption: "USER_ENTERED",
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res: any) => {
          navigation("/client/cost", {
            replace: true,
            state: { success: true },
          });
          setRefresh(true);
        })
        .catch((err) => {
          if (err.response.status == 400) {
            setMessage("Bad Request");
            return;
          }
          if (err.response.status == 401) {
            Cookies.remove("_token");
            navigation("/", { replace: true, state: "Invalid Token" });
            return;
          }
        })
        .then(() => {
          setLoading(false);
        });
    }
    return;
  };

  return (
    <>
      {errorPage ? (
        <div className="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-stone-600/50 z-50">
          <div className="max-w-xs bg-white dark:bg-stone-900 w-full rounded-lg shadow-lg dark:shadow-black/50 border border-slate-200 dark:border-stone-800">
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
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-stone-600/50 overflow-y-auto z-50">
          <div className="bg-white shadow-lg top-8 min-h-[calc(100vh-32px)] lg:min-h-screen lg:top-0 right-0 left-0 absolute w-full lg:w-96 dark:bg-stone-900 dark:border-l dark:border-stone-700 rounded-t-lg lg:left-auto lg:rounded-none">
            <div className="relative border-b dark:border-stone-800 border-stone-200">
              <h3 className="py-3 px-4 lg:px-6">Edit</h3>
              <button
                className="absolute right-2 top-1.5 flex justify-center items-center text-2xl w-8 h-8 dark:text-stone-500"
                onClick={close}
              >
                &times;
              </button>
            </div>

            <div className="px-4 py-3 lg:px-6 lg:py-5">
              {message.length > 0 && (
                <div className="text-sm py-2 px-4 my-2 bg-red-900 border border-red-700 rounded-md">
                  {message}
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block pb-1.5 text-stone-600 dark:text-stone-400 text-sm"
                >
                  Tanggal
                </label>

                <input
                  type="date"
                  className="border py-1.5 px-3 dark:bg-stone-900 border-stone-200 dark:border-stone-700 rounded-lg w-full disabled:bg-stone-100 disabled:text-slate-500 focus:outline-none focus:ring dark:focus:ring-stone-800 focus:ring-rose-100 focus:border-rose-200 dark:focus:border-rose-900 dark:disabled:bg-stone-800 dark:disabled:text-stone-400"
                  id="date"
                  defaultValue={date}
                  disabled
                />
                <span className="text-xs text-red-500">{errors.date}</span>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block pb-1.5 text-stone-600 dark:text-stone-400 text-sm"
                >
                  Jumlah
                </label>
                <input
                  type="number"
                  className="border py-1.5 px-3 dark:bg-stone-900 border-stone-200 dark:border-stone-700 rounded-lg w-full focus:outline-none focus:ring dark:focus:ring-stone-800 focus:ring-rose-100 focus:border-rose-200 dark:focus:border-rose-900"
                  id="amount"
                  value={amount}
                  onInput={handleAmount}
                  step="100"
                  autoFocus
                />
                <span className="text-xs text-red-500">{errors.amount}</span>
              </div>

              <div className="mb-2">
                <label
                  htmlFor="description"
                  className="block pb-1.5 text-stone-600 dark:text-stone-400 text-sm"
                >
                  Keterangan
                </label>
                <textarea
                  className="border py-1.5 px-3 dark:bg-stone-900 border-stone-200 dark:border-stone-700 rounded-lg w-full focus:outline-none focus:ring dark:focus:ring-stone-800 focus:ring-rose-100 focus:border-rose-200 dark:focus:border-rose-900"
                  id="description"
                  onInput={handleDescription}
                  defaultValue={description}
                ></textarea>
              </div>

              <div className="mb-4 flex flex-wrap -mx-2">
                <div className="px-2 w-1/2">
                  <button
                    className="w-full py-2 px-4 rounded-lg dark:bg-stone-800 dark:text-stone-400 focus:outline-none active:ring dark:active:ring-stone-700 dark:active:ring-opacity-40 bg-stone-100 active:ring-stone-200 dark:hover:text-stone-300 hover:text-stone-500 text-sm"
                    onClick={close}
                  >
                    Batal
                  </button>
                </div>
                <div className="px-2 w-1/2">
                  <button
                    className="w-full bg-rose-500 rounded-lg px-6 py-2 text-rose-200 hover:text-rose-100 dark:hover:text-rose-100 active:ring active:ring-rose-200 dark:bg-rose-700 dark:active:ring-stone-800 text-sm"
                    onClick={handleSubmit}
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
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CostUpdate;
