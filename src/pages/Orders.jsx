import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function Orders() {
  const URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // Load the full order list once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}get_orders.php`);
        const json = await res.json();
        setOrders(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <section className="surface-panel topbar topbar--flex">
        <div>
          <h1 className="fw-bold">Orders</h1>
        </div>
        <div className="search-bar-container">
          <Form>
            <InputGroup className="search-bar">
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
              />
            </InputGroup>
          </Form>
        </div>
      </section>

      <div className="surface-panel table-container">
        <p className="h5 mb-3">All Orders</p>
        {/* Header bubble */}
        <div className="table-header orders-cols">
          <span>Order #</span>
          <span>First</span>
          <span>Last</span>
          <span>Item</span>
          <span>Address Ln 1</span>
          <span>Address Ln 2</span>
          <span>City</span>
          <span>State</span>
          <span>Zip</span>
          <span>Shipping Date</span>
        </div>

        {/* Rows bubble — filtered client-side against every visible field */}
        <div className="table-body">
          {orders
            .filter((order) => {
              if (search.trim() === "") return true;
              const searchTerm = search.toLowerCase();
              const byOrderNum = order.order_num?.includes(search);
              const byFirst = order.first_name
                ?.toLowerCase()
                .includes(searchTerm);
              const byLast = order.last_name
                ?.toLowerCase()
                .includes(searchTerm);
              const byItem = order.item?.toLowerCase().includes(searchTerm);
              const byAddress1 = order.address_1
                ?.toLowerCase()
                .includes(searchTerm);
              const byAddress2 = order.address_2
                ?.toLowerCase()
                .includes(searchTerm);
              const byCity = order.city?.toLowerCase().includes(searchTerm);
              const byState = order.state?.toLowerCase().includes(searchTerm);
              const byZip = order.zip?.toLowerCase().includes(searchTerm);
              const byShippingDate = order.shipping_date?.includes(searchTerm);
              return (
                byOrderNum ||
                byFirst ||
                byLast ||
                byItem ||
                byAddress1 ||
                byAddress2 ||
                byCity ||
                byState ||
                byZip ||
                byShippingDate
              );
            })
            .map((order) => (
              <div className="table-row orders-cols" key={order.order_num}>
                <span data-label="Order #">{order.order_num}</span>
                <span data-label="First">{order.first_name}</span>
                <span data-label="Last">{order.last_name || "-"}</span>
                <span data-label="Item">{order.item}</span>
                <span data-label="Address Ln 1">{order.address_1}</span>
                <span data-label="Address Ln 2">{order.address_2 || "-"}</span>
                <span data-label="City">{order.city}</span>
                <span data-label="State">{order.state}</span>
                <span data-label="Zip">{order.zip}</span>
                <span data-label="Shipping Date">{order.shipping_date}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
