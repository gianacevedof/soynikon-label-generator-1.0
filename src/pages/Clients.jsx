import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getRole } from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import DetailModal from "../components/DetailModal";

function Clients() {
  const URL = import.meta.env.VITE_API_URL;
  const role = getRole();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [detailModal, setDetailModal] = useState({
    open: false,
    mode: "view",
    client: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}get_clients.php`);
        const json = await res.json();
        setClients(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const deleteClient = async (id) => {
    try {
      const res = await fetch(`${URL}delete_client.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ client_id: id }),
      });

      const json = await res.json();
      if (json.success) {
        setClients(clients.filter((client) => client.client_id !== id));
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error("Failed to delete client.");
      console.error(err);
    }
  };

  const openDetailModal = (client, mode) => {
    setDetailModal({ open: true, mode, client });
  };
  const closeDetailModal = () => {
    setDetailModal({ open: false, mode: "view", client: null });
  };

  return (
    <div>
      <section className="surface-panel page-header page-header--flex">
        <div>
          <h1 className="fw-bold">Clients</h1>
        </div>
        <div className="search-bar-container">
          <input
              className="search-bar"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />

          {role === "admin" && (
            <NavLink to="/new" className="clients-new">
              <FontAwesomeIcon icon={faPlus} /> New Client
            </NavLink>
          )}
        </div>
      </section>

      <div className="surface-panel table-container client-cards">
        <p className="h5 mb-3">All clients</p>

        {/* Card rows — filtered client-side against every field */}
        <div className="table-body">
          {clients
            .filter((client) => {
              if (!search.trim()) return true;
              const q = search.toLowerCase();
              return Object.values(client).some((v) =>
                String(v ?? "").toLowerCase().includes(q)
              );
            })
            .map((client) => (
              <div
                className="table-row"
                key={client.client_id}
                onClick={() => openDetailModal(client, "view")}
              >
                <span data-label="CLIENT">
                  {client.first_name} {client.last_name || ""}
                </span>
                <span data-label="PHONE">{client.phone || "-"}</span>
              </div>
            ))}
        </div>

        {detailModal.open && (
          <DetailModal
            type="client"
            mode={detailModal.mode}
            item={detailModal.client}
            onClose={closeDetailModal}
            onSave={(updated) =>
              setClients((prev) =>
                prev.map((c) =>
                  c.client_id === updated.client_id ? updated : c
                )
              )
            }
            onDelete={(id) => deleteClient(id)}
          />
        )}
      </div>
    </div>
  );
}

export default Clients;