import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../supabase-client";
import './AdminOrder.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          status,
          total_price,
          address,
          payment_method,
          payment_status,
          payment_screenshot,
          profiles:user_id ( id, name ),
          order_items (
            id,
            quantity,
            menu_items ( name, price )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg("Failed to fetch orders. Please try again.");
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Update order status only
  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      setErrorMsg("Failed to update order status.");
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  // Confirm payment only (QR)
  const confirmPayment = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "confirmed" })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      setErrorMsg("Failed to confirm payment.");
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, payment_status: "confirmed" } : o
        )
      );
    }
  };

  if (loading)
    return (
      <div className="admin-orders-loading">
        <div className="admin-orders-spinner"></div>
        <div className="admin-orders-loading-text">Loading orders...</div>
      </div>
    );

  if (errorMsg)
    return <div className="admin-orders-error">{errorMsg}</div>;

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-header">Admin - Orders</h2>
      {orders.length === 0 ? (
        <p className="admin-orders-empty">No orders yet.</p>
      ) : (
        <div className="admin-orders-table-wrapper">
          <table className="table table-bordered align-middle admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Address</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Update Order Status</th>
                <th>Confirm Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="admin-orders-order-id">{order.id}</span>
                  </td>
                  <td>
                    {order.profiles?.name ? (
                      <span className="admin-orders-customer">{order.profiles.name}</span>
                    ) : (
                      <span className="admin-orders-customer-fallback">
                        No name (id: {order.profiles?.id || "N/A"})
                      </span>
                    )}
                  </td>
                  <td>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="admin-orders-item">
                        <span className="admin-orders-item-name">
                          {item.menu_items?.name}
                        </span>
                        <span className="admin-orders-item-details">
                          {" × "}{item.quantity} (₹{item.menu_items?.price})
                        </span>
                      </div>
                    ))}
                  </td>
                  <td>
                    <span className="admin-orders-total">₹{order.total_price}</span>
                  </td>
                  <td>
                    {order.address ? (() => {
                      const addr = typeof order.address === "string" ? JSON.parse(order.address) : order.address;
                      return (
                        <div className="admin-orders-address">
                          <div className="admin-orders-address-field">
                            <span className="admin-orders-address-label">Name:</span>
                            <span className="admin-orders-address-value">{addr.fullName}</span>
                          </div>
                          <div className="admin-orders-address-field">
                            <span className="admin-orders-address-label">Phone:</span>
                            <span className="admin-orders-address-value">{addr.phone}</span>
                          </div>
                          <div className="admin-orders-address-field">
                            <span className="admin-orders-address-label">Street:</span>
                            <span className="admin-orders-address-value">{addr.street}</span>
                          </div>
                          <div className="admin-orders-address-field">
                            <span className="admin-orders-address-label">City:</span>
                            <span className="admin-orders-address-value">{addr.city}</span>
                          </div>
                          <div className="admin-orders-address-field">
                            <span className="admin-orders-address-label">ZIP:</span>
                            <span className="admin-orders-address-value">{addr.zip}</span>
                          </div>
                        </div>
                      );
                    })() : "No address"}
                  </td>
                  <td>
                    <span className={`admin-orders-payment-method ${order.payment_method}`}>
                      {order.payment_method}
                    </span>
                  </td>
                  <td className="admin-orders-payment-status">
                    {order.payment_method === "qr" && order.payment_screenshot ? (
                      <a 
                        href={order.payment_screenshot} 
                        target="_blank" 
                        rel="noreferrer"
                        className="admin-orders-screenshot-link"
                      >
                        {order.payment_status} (View Screenshot)
                      </a>
                    ) : (
                      order.payment_status
                    )}
                  </td>
                  <td>
                    <span
                      className={`admin-orders-status-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="admin-orders-status-select"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {order.payment_method === "qr" &&
                      order.payment_status === "pending" &&
                      order.payment_screenshot && (
                        <button
                          className="admin-orders-confirm-btn"
                          onClick={() => confirmPayment(order.id)}
                        >
                          Confirm Payment
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;