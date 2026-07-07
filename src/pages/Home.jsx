import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RotatingText from "../utils/reactbits/RotatingText";
import { getUsername } from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faUserPlus,
  faCartShopping,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import Topbar from "../components/Topbar";

function Home() {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const name = getUsername();
    if (name) {
      setUsername(name);
    }
  }, []);

  // Today's date, formatted for the greeting header
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Good Morning / Afternoon / Evening based on the current hour
  const hours = today.getHours();
  const time = hours < 12 ? "Morning" : hours < 18 ? "Afternoon" : "Evening";

  return (
    <div className="home">
      {/* Greeting header */}
      <section className="surface-panel topbar topbar--flex">
        <Topbar />
        <div>
          <h1 className="fw-bold">
            Good {time},<span className="capitalize"> {username}</span>
          </h1>
          <p>{formattedDate}</p>
        </div>
      </section>

      {/* Hero banner with rotating "Manage your ___" text */}
      <section>
        <div className="hero">
          <div className="hero-content">
            <p className="hero-static">Manage your</p>
            <RotatingText
              texts={["clients.", "orders.", "labels.", "business."]}
              mainClassName="rotating-word"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              splitBy="characters"
              auto
              loop
            />
          </div>
        </div>
      </section>

      {/* About blurb + quick-action cards to the main pages */}
      <section className="surface-panel about-section">
        <h2>About Soynikon Desk</h2>
        <p>
          Internal business management tool for Soynikon Photo Store. Manage
          clients, track orders, and generate shipping labels — all in one
          place.
        </p>

        <hr />

        <h2 className="quick-actions-heading">Quick Actions</h2>
        <div className="row justify-content-evenly">
          <div className="cards col-3">
            <Link to="/clients">
              <div className="icons">
                <FontAwesomeIcon icon={faUserGroup} />
              </div>
              <h4>Clients</h4>
              <p>View and manage clients</p>
            </Link>
          </div>
          <div className="cards col-3">
            <Link to="/orders">
              <div className="icons">
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <h4>Orders</h4>
              <p>Browse all orders</p>
            </Link>
          </div>
          <div className="cards col-3">
            <Link to="/labels">
              <div className="icons">
                <FontAwesomeIcon icon={faTruckFast} />
              </div>
              <h4>Labels</h4>
              <p>Generate shipping labels</p>
            </Link>
          </div>
          <div className="cards col-3">
            <Link to="/new">
              <div className="icons">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <h4>New client</h4>
              <p>Register a customer</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;