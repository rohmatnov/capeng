import { Link } from "react-router-dom";

export interface ErrorPage {
  status?: number;
  message?: string;
}

function Error(props: ErrorPage): JSX.Element {
  const { status = 404, message = "Page Not Found" } = props;
  return (
    <div className="flex bg-stone-100 min-h-screen items-center justify-center">
      <div className="max-w-lg w-full relative">
        <h3 className="text-7xl text-center mb-6">{status}</h3>
        <div className="relative z-20 bg-white rounded-lg shadow text-center p-6">
          <div className="text-lg font-semibold my-1 capitalize">{message}</div>
          <div className="text-stone-500 my-1">
            Halaman tidak ada, mungkin halaman telah pindahkan, dihapus atau
            anda tidak memiliki akses.
          </div>
          <div className="mt-4">
            <Link
              to="/"
              className="inline-block py-1 text-sm px-4 rounded-full bg-rose-500 text-white"
            >
              Ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
