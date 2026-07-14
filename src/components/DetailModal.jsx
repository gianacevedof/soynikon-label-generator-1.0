import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faFloppyDisk,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

function DetailModal({ item, type, mode: initialMode, onClose, onSave, onDelete }) {
  const URL = import.meta.env.VITE_API_URL;
  const [mode, setMode] = useState(initialMode); // "view" | "edit" | "delete"
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ...item,
    last_name: item.last_name ?? "",
    phone: item.phone ?? "",
    address_2: item.address_2 ?? "",
    shipping_date: item.shipping_date ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const endpoint = type === "client" ? "edit_client.php" : "edit_order.php";
    try {
      const res = await fetch(`${URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        onSave(formData);
        onClose();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete(item[type === "client" ? "client_id" : "order_num"]);
    onClose();
  };

  // Shared field config: array of { label, key, type, colClass }
  const fields =
    type === "client"
      ? [
          { label: "First Name", key: "first_name", type: "text", colClass: "col-md-6" },
          { label: "Last Name", key: "last_name", type: "text", colClass: "col-md-6" },
          { label: "Phone", key: "phone", type: "tel", colClass: "col-md-6" },
          { label: "Address 1", key: "address_1", type: "text", colClass: "col-12" },
          { label: "Address 2", key: "address_2", type: "text", colClass: "col-12" },
          { label: "City", key: "city", type: "text", colClass: "col-md-6" },
          { label: "State", key: "state", type: "select", colClass: "col-md-4" },
          { label: "Zip", key: "zip", type: "text", colClass: "col-md-2" },
        ]
      : [
          { label: "Order #", key: "order_num", type: "text", colClass: "col-md-4", readonly: true },
          { label: "First Name", key: "first_name", type: "text", colClass: "col-md-4" },
          { label: "Last Name", key: "last_name", type: "text", colClass: "col-md-4" },
          { label: "Item", key: "item", type: "text", colClass: "col-12" },
          { label: "Address 1", key: "address_1", type: "text", colClass: "col-12" },
          { label: "Address 2", key: "address_2", type: "text", colClass: "col-12" },
          { label: "City", key: "city", type: "text", colClass: "col-md-6" },
          { label: "State", key: "state", type: "select", colClass: "col-md-4" },
          { label: "Zip", key: "zip", type: "text", colClass: "col-md-2" },
          { label: "Shipping Date", key: "shipping_date", type: "date", colClass: "col-md-4" },
        ];

  // Full US states list
  const US_STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
    "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
    "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana",
    "Maine","Maryland","Massachusetts","Michigan","Minnesota",
    "Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York",
    "North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
    "Pennsylvania","Rhode Island","South Carolina","South Dakota",
    "Tennessee","Texas","Utah","Vermont","Virginia","Washington",
    "West Virginia","Wisconsin","Wyoming",
  ];

  const title =
    type === "client"
      ? `${formData.first_name} ${formData.last_name || ""}`.trim() || "Client Details"
      : `Order ${formData.order_num}`;

  return (
    <>
      <div className="detail-modal-backdrop" onClick={onClose} />
      <div className={`detail-modal ${mode}`}>
        {/* Header */}
        <div className="detail-modal-header">
          <h3>{title}</h3>
          <button className="detail-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body */}
        <div className="detail-modal-body">
          {mode === "delete" ? (
            <div className="detail-modal-delete-confirm">
              <FontAwesomeIcon icon={faTriangleExclamation} className="delete-icon" />
              <p>Are you sure you want to delete this {type}?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
          ) : (
            <div className="row g-3">
              {fields.map((f) => (
                <div key={f.key} className={f.colClass}>
                  <label className="detail-modal-label">{f.label}</label>
                  {mode === "edit" && !f.readonly ? (
                    f.type === "select" ? (
                      <select
                        className="detail-modal-input"
                        name={f.key}
                        value={formData[f.key] || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Choose...</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        className="detail-modal-input"
                        name={f.key}
                        value={formData[f.key] || ""}
                        onChange={handleChange}
                        required={f.key !== "last_name" && f.key !== "phone" && f.key !== "address_2"}
                      />
                    )
                  ) : (
                    <p className="detail-modal-value">
                      {f.key === "shipping_date" && formData[f.key]
                        ? new Date(formData[f.key]).toLocaleDateString()
                        : formData[f.key] || "-"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="detail-modal-footer">
          {mode === "view" && (
            <>
              <button className="dbtn dbtn-outline" onClick={onClose}>Close</button>
              <div className="detail-modal-actions">
                {type === "client" && (
                  <button className="dbtn dbtn-warning" onClick={() => setMode("edit")}>
                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                  </button>
                )}
                <button className="dbtn dbtn-danger" onClick={() => setMode("delete")}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </>
          )}
          {mode === "edit" && (
            <>
              <button className="dbtn dbtn-outline" onClick={() => setMode("view")} disabled={saving}>
                Cancel
              </button>
              <button className="dbtn dbtn-warning" onClick={handleSave} disabled={saving}>
                <FontAwesomeIcon icon={faFloppyDisk} /> {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
          {mode === "delete" && (
            <>
              <button className="dbtn dbtn-outline" onClick={() => setMode("view")}>
                Cancel
              </button>
              <button className="dbtn dbtn-danger" onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DetailModal;