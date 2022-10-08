import { Routes, Route } from "react-router-dom";
import Authenticated from "../components/guards/Authenticated";
import Home from "../components/Home";
import Error from "../components/Error";
import ClientIndex from "../components/clients/ClientIndex";
import CostIndex from "../components/clients/cost/CostIndex";
import CostCreate from "../components/clients/cost/CostCreate";
import CostDelete from "../components/clients/cost/CostDelete";
import CostUpdate from "../components/clients/cost/CostUpdate";

export default function Root(): JSX.Element {
  return (
    <div className="text-stone-700">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/client" element={<Authenticated />}>
          <Route index element={<ClientIndex />} />

          <Route path="cost" element={<CostIndex />}>
            <Route path="create" element={<CostCreate />} />
            <Route path=":row/edit" element={<CostUpdate />} />
            <Route path=":row/delete" element={<CostDelete />} />
          </Route>
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}
