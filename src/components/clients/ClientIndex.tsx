import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";
import Error, { ErrorPage } from "../Error";
import { useInfo } from "../guards/Authenticated";

function ClientIndex() {
  const { token, setTitle, setBack } = useInfo();
  const startDate = moment().startOf("month");
  const endDate = moment();
  const URL = `${import.meta.env.VITE_URL}/values/${
    import.meta.env.VITE_SHEET_TAB
  }!B2:D`;
  const auth = useAuth();

  const navigation = useNavigate();
  const [error, setError] = useState<ErrorPage>();

  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState<string>("0");

  const sheetApi = async () => {
    try {
      let { data } = await axios.get(URL, {
        params: { key: import.meta.env.VITE_GOOGLE_API_KEY },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const total = data?.values
        .filter((val: any) =>
          moment(val[0], "DD/MM/YYYY").isBetween(
            startDate,
            endDate,
            undefined,
            "[]"
          )
        )
        .map((val: any) => parseInt(val[1].replace(/[^\d]+/gi, "")))
        .reduce((acc: number, curr: number) => (acc += curr));
      const formatter = new Intl.NumberFormat("id-ID");
      setAmount(formatter.format(total));
      setRows(data?.values?.reverse().slice(0, 10) || []);
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
    setTitle("Dashboard");
    setBack(undefined);
    sheetApi();
  }, []);

  return error ? (
    <Error {...error} />
  ) : (
    <div className="max-w-5xl mx-auto">
      <div className="bg-rose-500 border-rose-600 shadow dark:bg-stone-800/50 border dark:border-stone-800 p-6 rounded-lg mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Bulan Ini
        </div>
        <div className="text-2xl">Rp{amount}</div>
      </div>

      <div>
        <div className="mt-4 flex justify-between items-center">
          <h3 className="font-semibold">Transaksi Terakhir</h3>
          <Link to="cost" relative="route" className="text-rose-700 text-sm">
            Lihat semua
          </Link>
        </div>

        <div className="py-2">
          {rows.map((row, index) => (
            <List row={row} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientIndex;

function List(props: any): JSX.Element {
  const { row } = props;

  return (
    <div className="flex flex-wrap px-4 py-3 border border-stone-100 dark:border-stone-800/50 rounded-lg mb-3 text-sm shadow dark:shadow-black/30 dark:text-stone-400">
      <div className="w-auto pr-4">
        <div className="font-semibold">{row[0]}</div>
        <small className="text-gray-500 dark:text-stone-500 text-xs">
          Tanggal
        </small>
      </div>
      <div className="flex-1 overflow-hidden text-right">
        <div className="flex flex-col">
          <div className="font-semibold">{row[1]}</div>
          <small className="text-gray-500 dark:text-stone-500 truncate text-xs">
            {row[2] || "-"}
          </small>
        </div>
      </div>
    </div>
  );
}
