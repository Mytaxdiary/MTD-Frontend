import { useState } from "react";
import Dashboard from "./mtd_agent_dashboard.jsx";
import ClientList from "./mtd_client_list.jsx";
import AddClient from "./mtd_add_client.jsx";
import ClientDetail from "./mtd_client_detail.jsx";
import ChaseManager from "./mtd_chase_manager.jsx";
import QuarterlyReview from "./mtd_quarterly_review.jsx";
import Settings from "./mtd_settings.jsx";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const navigate = (p) => setPage(p);

  return (
    <>
      {page === "dashboard" && <Dashboard navigate={navigate} />}
      {page === "clients" && <ClientList navigate={navigate} />}
      {page === "add-client" && <AddClient navigate={navigate} />}
      {page === "client-detail" && <ClientDetail navigate={navigate} />}
      {page === "chase" && <ChaseManager navigate={navigate} />}
      {page === "quarterly-review" && <QuarterlyReview navigate={navigate} />}
      {page === "settings" && <Settings navigate={navigate} />}
    </>
  );
}
