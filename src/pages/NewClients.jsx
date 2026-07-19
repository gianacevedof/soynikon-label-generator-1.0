import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import US_STATES from "../utils/states";

function NewClients() {
  const URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address_1: "",
    address_2: "",
    zip: "",
    city: "",
    state: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const submitFormData = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${URL}add_client.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        toast.success(json.message);
        // Reset the form so the user can add another client right away
        setFormData((f) => ({
          ...f,
          first_name: "",
          last_name: "",
          phone: "",
          address_1: "",
          address_2: "",
          zip: "",
          city: "",
          state: "",
        }));
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="surface-panel new-form">
        <h5 className="new-form-intro">
          Fill in the client's information below
        </h5>
        <form onSubmit={submitFormData}>
          <div className="contact row g-3">
            <p className="fw-bold">
              <FontAwesomeIcon icon={faCircleUser} /> CONTACT INFO
            </p>
            <hr />
            <div className="col-md-6">
              <label htmlFor="inputFirst" className="form-label">
                First name
              </label>
              <input
                type="text"
                className="form-control"
                id="inputFirst"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="e.g. Giancarlo"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputLast" className="form-label">
                Last name
              </label>
              <input
                type="text"
                className="form-control"
                id="inputLast"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="e.g. Acevedo"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputPhone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="inputPhone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="809-000-000"
              />
            </div>
          </div>

          <div className="address row g-3">
            <p className="fw-bold">
              <FontAwesomeIcon icon={faLocationDot} /> ADDRESS
            </p>
            <hr />
            <div className="col-12">
              <label htmlFor="inputAddress" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                name="address_1"
                placeholder="1234 Main St"
                value={formData.address_1}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputAddress2" className="form-label">
                Address 2
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress2"
                name="address_2"
                placeholder="Apartment, studio, or floor"
                value={formData.address_2}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCity" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="inputCity"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Orlando"
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="inputState" className="form-label">
                State
              </label>
              <select
                className="form-select"
                id="inputState"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Choose...
                </option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label htmlFor="inputZip" className="form-label">
                Zip
              </label>
              <input
                type="text"
                className="form-control"
                id="inputZip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="11011"
                required
              />
            </div>
          </div>

          <div className="col-12">
            <button type="submit">Add client</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewClients;
