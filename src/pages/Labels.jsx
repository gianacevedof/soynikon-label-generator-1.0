import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faBagShopping,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { getRole } from "../utils/auth";
import LabelDocument from "../components/LabelDocument";

function Labels() {
  const URL = import.meta.env.VITE_API_URL;
  const role = getRole();

  // MM-DD-YYYY, used both in the on-screen preview and passed into the PDF
  const today = new Date();
  const formattedDate =
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0") +
    "-" +
    today.getFullYear();

  const [clientSearch, setClientSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [clientResults, setClientResults] = useState([]);
  const [itemResults, setItemResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderReady, setOrderReady] = useState(false);

  useEffect(() => {
    if (clientSearch.length < 1) {
      setClientResults([]);
      return;
    }

    const fetchClients = async () => {
      try {
        const res = await fetch(
          `${URL}search_clients.php?q=${encodeURIComponent(clientSearch)}`,
        );
        const data = await res.json();
        setClientResults(data);
      } catch (err) {
        console.error("Client search error:", err);
      }
    };
    fetchClients();
  }, [clientSearch]);

  useEffect(() => {
    if (itemSearch.length < 1) {
      setItemResults([]);
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await fetch(
          `${URL}search_items.php?q=${encodeURIComponent(itemSearch)}`,
        );
        const data = await res.json();
        setItemResults(data);
      } catch (err) {
        console.error("Item search error:", err);
      }
    };
    fetchItems();
  }, [itemSearch]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setClientSearch(`${client.first_name} ${client.last_name}`);
    setClientResults([]);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setItemSearch(item.item);
    setItemResults([]);
  };

  // Admin-only: creates a brand-new item on the fly when a search
  // for it comes up empty, then selects it immediately.
  const handleAddItem = async () => {
    const trimmed = itemSearch.trim();
    if (!trimmed) return;

    const formData = new FormData();
    formData.append("item_name", trimmed);

    try {
      const res = await fetch(`${URL}save_item.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setSelectedItem({ item_id: data.item_id, item: trimmed });
        setItemResults([]);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Add item error:", err);
    }
  };

  // Saves the order (client + item + today's date) and unlocks the
  // PDF download link once the backend hands back an order_id.
  const handleGenerate = async () => {
    if (!selectedClient || !selectedItem) {
      toast.error("Select a client and an item first.");
      return;
    }

    const formData = new FormData();
    formData.append("client_id", selectedClient.client_id);
    formData.append("item_id", selectedItem.item_id);
    formData.append("shipping_date", new Date().toISOString().split("T")[0]);

    try {
      const res = await fetch(`${URL}save_order.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setOrderId(data.order_id);
        setOrderReady(true);
        toast.success("Order saved — label ready.");
      } else {
        toast.error("Error saving order: " + data.message);
      }
    } catch (err) {
      console.error("Save order error:", err);
    }
  };

  const handleReset = () => {
    setClientSearch("");
    setItemSearch("");
    setClientResults([]);
    setItemResults([]);
    setSelectedClient(null);
    setSelectedItem(null);
    setOrderId(null);
    setOrderReady(false);
  };

  return (
    <div>

      <div className="labels-grid">
        {/* DETAILS PANEL — recipient + item search */}
        <div className="surface-panel label-details">
          <h3 className="label-panel-title">Details</h3>
          <hr className="label-divider" />

          <div className="label-field-group">
            <label className="label-field-label">
              <FontAwesomeIcon icon={faCircleUser} /> Recipient
            </label>
            <div className="label-input-row">
              <div className="label-input-wrap">
                <input
                  className="label-input"
                  placeholder="Search client..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setSelectedClient(null);
                    setOrderReady(false);
                  }}
                />
                {clientResults.length > 0 && (
                  <div className="label-dropdown">
                    {clientResults.map((client) => (
                      <div
                        key={client.client_id}
                        className="label-dropdown-item"
                        onClick={() => handleSelectClient(client)}
                      >
                        <span className="label-dropdown-name">
                          {client.first_name} {client.last_name}
                        </span>
                        <span className="label-dropdown-meta">
                          {client.city}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {role === "admin" && (
                <NavLink
                  to="/new"
                  className="dbtn dbtn-warning"
                >
                  <FontAwesomeIcon icon={faPlus} /> New
                </NavLink>
              )}
            </div>
          </div>

          <div className="label-field-group">
            <label className="label-field-label">
              <FontAwesomeIcon icon={faBagShopping} /> Item
            </label>
            <div className="label-input-row">
              <div className="label-input-wrap">
                <input
                  className="label-input"
                  placeholder="Search item..."
                  value={itemSearch}
                  onChange={(e) => {
                    setItemSearch(e.target.value);
                    setSelectedItem(null);
                    setOrderReady(false);
                  }}
                />
                {itemResults.length > 0 && (
                  <div className="label-dropdown">
                    {itemResults.map((item) => (
                      <div
                        key={item.item_id}
                        className="label-dropdown-item"
                        onClick={() => handleSelectItem(item)}
                      >
                        <span className="label-dropdown-name">
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {role === "admin" && (
                <button
                  className="dbtn dbtn-warning"
                  onClick={handleAddItem}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PREVIEW PANEL — live sticker preview + generate/download/reset */}
        <div className="surface-panel label-preview">
          <h3 className="label-panel-title">Preview</h3>
          <hr className="label-divider" />

          <div className="label-sticker">
            <div className="label-sticker-row">
              <div>
                <p className="label-sticker-section-title">ORDER DETAILS</p>
                <p className="label-sticker-order-num">
                  Order #: {orderId ?? "—"}
                </p>
                <p className="label-sticker-text">
                  Item: {selectedItem?.item ?? "—"}
                </p>
                <p className="label-sticker-text">Date: {formattedDate}</p>
              </div>
              <div className="label-sticker-img-wrap">
                <img src="soynikon-logo.png" alt="Soynikon logo" />
              </div>
            </div>

            <hr className="label-sticker-hr" />

            <p className="label-sticker-section-title">SHIP TO</p>
            {selectedClient ? (
              <>
                <p className="label-sticker-name">
                  {selectedClient.first_name} {selectedClient.last_name}
                </p>
                <p className="label-sticker-text">
                  {selectedClient.address_1}
                </p>
                {selectedClient.address_2 && (
                  <p className="label-sticker-text">
                    {selectedClient.address_2}
                  </p>
                )}
                <p className="label-sticker-text">
                  {selectedClient.city}, {selectedClient.state}{" "}
                  {selectedClient.zip}
                </p>
              </>
            ) : (
              <p className="label-sticker-empty">No client selected</p>
            )}

            <hr className="label-sticker-hr" />

            <p className="label-sticker-section-title">FROM</p>
            <p className="label-sticker-text">Soynikon Photo Store</p>
            <p className="label-sticker-text">5th Ave</p>
            <p className="label-sticker-text">New York, NY 10001</p>

            <hr className="label-sticker-hr" />

            <div className="label-sticker-row">
              <p className="label-sticker-section-title m-0">NOTES</p>
              <div className="label-barcode-img-wrap">
                <img src="barcode.png" alt="Image of a barcode" />
              </div>
              <div className="label-sticker-img-wrap">
                <img src="fragile.png" alt="Fragile" />
              </div>
            </div>
          </div>

          <div className="label-actions">
            {!orderReady ? (
              <button
                className="dbtn dbtn-warning"
                onClick={handleGenerate}
              >
                Generate Label
              </button>
            ) : (
              <PDFDownloadLink
                document={
                  <LabelDocument
                    selectedClient={selectedClient}
                    selectedItem={selectedItem}
                    orderId={orderId}
                    date={formattedDate}
                  />
                }
                fileName="soynikon-desk-label.pdf"
              >
                {({ loading }) => (
                  <button className="dbtn dbtn-warning">
                    {loading ? "Preparing..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            )}
            <button
              className="dbtn dbtn-outline"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Labels;
