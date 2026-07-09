import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getRole } from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";

function Clients() {
  const URL = import.meta.env.VITE_API_URL;
  const role = getRole();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Load the full client list once on mount
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

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  function selectClient(client) {
    setSelectedClient(client);
  }

  return (
    <div>
      <section className="surface-panel topbar topbar--flex">
        <div>
          <h1 className="fw-bold">Clients</h1>
        </div>
        <div className="search-bar-container">
          <Form className="search-bar">
            <InputGroup>
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
              />
            </InputGroup>
          </Form>

          {role === "admin" && (
            <NavLink to="/new" className="clients-new">
              <FontAwesomeIcon icon={faPlus} /> New Client
            </NavLink>
          )}
        </div>
      </section>

      <div className="surface-panel table-container">
        <p className="h5 mb-3">All clients</p>

        {/* Header bubble */}
        <div
          className={`table-header ${role === "admin" ? "admin-cols" : "standard-cols"}`}
        >
          <span>First</span>
          <span>Last</span>
          <span>Phone</span>
          <span>Address Ln 1</span>
          <span>Address Ln 2</span>
          <span>City</span>
          <span>State</span>
          <span>Zip</span>
          {role === "admin" && <span>Actions</span>}
        </div>

        {/* Rows bubble — filtered client-side against every visible field */}
        <div className="table-body">
          {clients
            .filter((client) => {
              if (search.trim() === "") return true;
              const searchTerm = search.toLowerCase();
              const byFirst = client.first_name
                ?.toLowerCase()
                .includes(searchTerm);
              const byLast = client.last_name
                ?.toLowerCase()
                .includes(searchTerm);
              const byPhone = client.phone?.includes(searchTerm);
              const byAddress1 = client.address_1
                ?.toLowerCase()
                .includes(searchTerm);
              const byAddress2 = client.address_2
                ?.toLowerCase()
                .includes(searchTerm);
              const byCity = client.city?.toLowerCase().includes(searchTerm);
              const byState = client.state?.toLowerCase().includes(searchTerm);
              const byZip = client.zip?.toLowerCase().includes(searchTerm);
              return (
                byFirst ||
                byLast ||
                byPhone ||
                byAddress1 ||
                byAddress2 ||
                byCity ||
                byState ||
                byZip
              );
            })
            .map((client) => {
              const addressParts = [client.address_1]
                .concat(client.address_2 ? [client.address_2] : []);
              const addressStr = [...addressParts, client.city, client.state, client.zip]
                .filter(Boolean).join(", ");

              return (
                <div
                  className={`table-row ${role === "admin" ? "admin-cols" : "standard-cols"}`}
                  key={client.client_id}
                >
                  <span data-label="CLIENT">{client.first_name} {client.last_name || ""}</span>
                  <span data-label="PHONE">{client.phone || "-"}</span>
                  <span data-label="ADDRESS">{addressStr}</span>
                  {role === "admin" && (
                    <span className="table-actions">
                      <button
                        onClick={() => {
                          selectClient(client);
                          toggleEditModal();
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => {
                          selectClient(client);
                          toggleDeleteModal();
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </span>
                  )}
                </div>
              );
            })}
        </div>

        {editModal && (
          <EditModal
            setToggleEditModal={toggleEditModal}
            clientData={selectedClient}
            setClients={setClients}
          />
        )}
        {deleteModal && (
          <DeleteModal
            setToggleDeleteModal={toggleDeleteModal}
            clientData={selectedClient}
            deleteClient={deleteClient}
          />
        )}
      </div>
    </div>
  );
}

export default Clients;
