import { useState } from "react";
import AppShell from "./components/layout/appShell";
import Dashboard from "./features/dashboard/agentDashboard";
import ClientList from "./features/clients/clientList";
import AddClient from "./features/clients/addClient";
import ClientDetail from "./features/clients/clientDetail";
import ChaseManager from "./features/chase/chaseManager";
import QuarterlyReview from "./features/quarterly/quarterlyReview";
import Settings from "./features/settings/settings";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const navigate = (p) => setPage(p);

  return (
    <AppShell navigate={navigate} activePage={page}>
      {page === "dashboard" && <Dashboard navigate={navigate} />}
      {page === "clients" && <ClientList navigate={navigate} />}
      {page === "add-client" && <AddClient navigate={navigate} />}
      {page === "client-detail" && <ClientDetail navigate={navigate} />}
      {page === "chase" && <ChaseManager navigate={navigate} />}
      {page === "quarterly-review" && <QuarterlyReview navigate={navigate} />}
      {page === "settings" && <Settings navigate={navigate} />}
    </AppShell>
  );
}
