import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DetailModal from "../components/DetailModal";

function Orders() {
  const URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [detailModal, setDetailModal] = useState({
    open: false,
    mode: "view",
    item: null,
  });

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

  const openDetailModal = (order, mode) => {
    setDetailModal({ open: true, mode, item: order });
  };
  const closeDetailModal = () => {
    setDetailModal({ open: false, mode: "view", item: null });
  };

  return (
    <div>
      <section className="surface-panel page-header page-header--flex">
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

      <div className="surface-panel table-container order-cards">
        <p className="h5 mb-3">All Orders</p>

        {/* Card rows — filtered client-side against every visible field */}
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
              <div
                className="table-row"
                key={order.order_num}
                onClick={() => openDetailModal(order, "view")}
              >
                <span data-label="Order #">{order.order_num}</span>
                <span data-label="CLIENT">
                  {order.first_name} {order.last_name || "-"}
                </span>
                <span data-label="ITEM">{order.item}</span>
                <span data-label="Shipping Date">{order.shipping_date}</span>
              </div>
            ))}
        </div>

        {detailModal.open && (
          <DetailModal
            type="order"
            mode={detailModal.mode}
            item={detailModal.item}
            onClose={closeDetailModal}
            onSave={() => {}}
            onDelete={() => {}}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;