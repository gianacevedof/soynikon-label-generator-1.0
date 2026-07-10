import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faLocationDot } from "@fortawesome/free-solid-svg-icons";

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
      <section className="surface-panel page-header">
        <h1 className="fw-bold">Add new client</h1>
        <p>Fill in the client's information below</p>
      </section>

      <div className="surface-panel new-form">
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
