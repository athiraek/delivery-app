import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase-client";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login?redirect=/orders");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          status,
          total_price,
          address,
          order_items (
            id,
            quantity,
            price,
            menu_items ( name )
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to cancel order:", error);
    } else {
      // Update local state so UI updates immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          const addr =
            order.address && typeof order.address === "string"
              ? JSON.parse(order.address)
              : order.address;

          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Order </span>
                <span>Status: {order.status}</span>
              </div>
              <div className="order-body">
                <p>
                  <strong>Placed on:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.total_price}
                </p>

                <p>
                  <strong>Address:</strong>
                </p>
                {addr ? (
                  <div className="order-address">
                    <div className="order-address-field">
                      <span className="order-address-label">Name:</span>
                      <span className="order-address-value">{addr.fullName}</span>
                    </div>
                    <div className="order-address-field">
                      <span className="order-address-label">Phone:</span>
                      <span className="order-address-value">{addr.phone}</span>
                    </div>
                    <div className="order-address-field">
                      <span className="order-address-label">Street:</span>
                      <span className="order-address-value">{addr.street}</span>
                    </div>
                    <div className="order-address-field">
                      <span className="order-address-label">City:</span>
                      <span className="order-address-value">{addr.city}</span>
                    </div>
                    <div className="order-address-field">
                      <span className="order-address-label">ZIP:</span>
                      <span className="order-address-value">{addr.zip}</span>
                    </div>
                  </div>
                ) : (
                  <p>No address</p>
                )}

                <h4>Items:</h4>
                <div className="order-items">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="order-item">
                      <span className="order-item-name">{item.menu_items?.name}</span>
                      <span className="order-item-details">
                        {" × "}{item.quantity} (₹{item.price})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Show Cancel button only if order is pending */}
                {order.status === "pending" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
