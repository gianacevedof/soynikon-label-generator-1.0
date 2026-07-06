import { useState } from "react";
import { toast } from "sonner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ClientModal({ setToggleEditModal, clientData, setClients }) {
  const URL = import.meta.env.VITE_API_URL;

  // Some fields (last_name, phone, address_2) can come back null from the
  // API. Coalescing to "" here keeps every input controlled from the start —
  // otherwise React logs a warning the first time one of these fields goes
  // from null to a typed value.
  const [formData, setFormData] = useState({
    ...clientData,
    last_name: clientData.last_name ?? "",
    phone: clientData.phone ?? "",
    address_2: clientData.address_2 ?? "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const submitFormData = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${URL}edit_client.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setToggleEditModal();
        // Merge the edited fields into the matching client in the list,
        // instead of refetching the whole table.
        setClients((c) =>
          c.map((c) =>
            c.client_id === clientData.client_id ? { ...c, ...formData } : c,
          ),
        );
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal show={true} onHide={setToggleEditModal} animation={true} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submitFormData} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="editFirst" className="form-label">
              First
            </label>
            <input
              type="text"
              className="form-control"
              id="editFirst"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="editLast" className="form-label">
              Last
            </label>
            <input
              type="text"
              className="form-control"
              id="editLast"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="editPhone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="editPhone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12">
            <label htmlFor="editAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="editAddress"
              name="address_1"
              placeholder="1234 Main St"
              value={formData.address_1}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="editAddress2" className="form-label">
              Address 2
            </label>
            <input
              type="text"
              className="form-control"
              id="editAddress2"
              name="address_2"
              placeholder="Apartment, studio, or floor"
              value={formData.address_2}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="editCity" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="editCity"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="editState" className="form-label">
              State
            </label>
            <select
              className="form-select"
              id="editState"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Choose...
              </option>
              <option value="Alabama">Alabama</option>
              <option value="Alaska">Alaska</option>
              <option value="Arizona">Arizona</option>
              <option value="Arkansas">Arkansas</option>
              <option value="California">California</option>
              <option value="Colorado">Colorado</option>
              <option value="Connecticut">Connecticut</option>
              <option value="Delaware">Delaware</option>
              <option value="Florida">Florida</option>
              <option value="Georgia">Georgia</option>
              <option value="Hawaii">Hawaii</option>
              <option value="Idaho">Idaho</option>
              <option value="Illinois">Illinois</option>
              <option value="Indiana">Indiana</option>
              <option value="Iowa">Iowa</option>
              <option value="Kansas">Kansas</option>
              <option value="Kentucky">Kentucky</option>
              <option value="Louisiana">Louisiana</option>
              <option value="Maine">Maine</option>
              <option value="Maryland">Maryland</option>
              <option value="Massachusetts">Massachusetts</option>
              <option value="Michigan">Michigan</option>
              <option value="Minnesota">Minnesota</option>
              <option value="Mississippi">Mississippi</option>
              <option value="Missouri">Missouri</option>
              <option value="Montana">Montana</option>
              <option value="Nebraska">Nebraska</option>
              <option value="Nevada">Nevada</option>
              <option value="New Hampshire">New Hampshire</option>
              <option value="New Jersey">New Jersey</option>
              <option value="New Mexico">New Mexico</option>
              <option value="New York">New York</option>
              <option value="North Carolina">North Carolina</option>
              <option value="North Dakota">North Dakota</option>
              <option value="Ohio">Ohio</option>
              <option value="Oklahoma">Oklahoma</option>
              <option value="Oregon">Oregon</option>
              <option value="Pennsylvania">Pennsylvania</option>
              <option value="Rhode Island">Rhode Island</option>
              <option value="South Carolina">South Carolina</option>
              <option value="South Dakota">South Dakota</option>
              <option value="Tennessee">Tennessee</option>
              <option value="Texas">Texas</option>
              <option value="Utah">Utah</option>
              <option value="Vermont">Vermont</option>
              <option value="Virginia">Virginia</option>
              <option value="Washington">Washington</option>
              <option value="West Virginia">West Virginia</option>
              <option value="Wisconsin">Wisconsin</option>
              <option value="Wyoming">Wyoming</option>
            </select>
          </div>
          <div className="col-md-2">
            <label htmlFor="editZip" className="form-label">
              Zip
            </label>
            <input
              type="text"
              className="form-control"
              id="editZip"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setToggleEditModal}>
          Cancel
        </Button>
        <Button
          variant="warning"
          className="text-white"
          onClick={submitFormData}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClientModal;
