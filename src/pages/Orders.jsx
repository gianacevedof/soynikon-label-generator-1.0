import { useState, useEffect } from "react";
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
      <div className="surface-panel table-container order-cards">
        <div className="table-head-row">
          <h5 className="m-0">All Orders</h5>
          <div className="table-head-actions">
            <input
              className="search-bar"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />
          </div>
        </div>

        {/* Card rows — filtered client-side against every visible field */}
        <div className="table-body">
          {orders
            .filter((order) => {
              if (!search.trim()) return true;
              const q = search.toLowerCase();
              return Object.values(order).some((v) =>
                String(v ?? "").toLowerCase().includes(q)
              );
            })
            .map((order) => (
              <div
                className="table-row"
                key={order.order_num}
                onClick={() => openDetailModal(order, "view")}
              >
                <div className="order-card-row order-card-top">
                  <span className="order-card-num">#{order.order_num}</span>
                  <span className="order-card-client">
                    {order.first_name} {order.last_name || "-"}
                  </span>
                </div>
                <div className="order-card-row order-card-bottom">
                  <span className="order-card-item">{order.item}</span>
                  <span className="order-card-date">{order.shipping_date}</span>
                </div>
              </div>
            ))}
        </div>

        {detailModal.open && (
          <DetailModal
            type="order"
            mode={detailModal.mode}
            item={detailModal.item}
            onClose={closeDetailModal}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;