import { useStore } from "../../../../Context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
  });

  // ✅ If coming from Buy Now, get that item
  const buyNowItem = location.state?.buyNowItem;
  const items = buyNowItem ? [buyNowItem] : Object.values(cartItems);

  // Redirect if no items
  useEffect(() => {
    if (!buyNowItem && items.length === 0) {
      navigate("/cart");
    }
  }, [items, buyNowItem, navigate]);

  // Calculate total
  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.discountedPrice,
    0
  );

  const handleProceedToPayment = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.zip
    ) {
      alert("Please fill in all delivery address fields.");
      return;
    }

    navigate("/payment", {
      state: { items, buyNowItem: buyNowItem || null, address, total },
    });
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-header">
          <h2 className="checkout-title">Checkout</h2>
        </div>

        <div className="checkout-content">
          {/* Left Side - Address */}
          <div className="checkout-left">
            <div className="checkout-card">
              <h3 className="section-title">Delivery Address</h3>
              <div className="address-form">
                <input
                  className="checkout-form-input"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                />
                <input
                  className="checkout-form-input"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                />
                <input
                  className="checkout-form-input"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
                <input
                  className="checkout-form-input"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <input
                  className="checkout-form-input"
                  placeholder="ZIP Code"
                  value={address.zip}
                  onChange={(e) =>
                    setAddress({ ...address, zip: e.target.value })
                  }
                />
              </div>
            </div>
            <button onClick={handleProceedToPayment} className="confirm-btn">
              Proceed to Payment
            </button>
          </div>

          {/* Right Side - Order Summary */}
          <div className="checkout-right">
            <div className="checkout-card">
              <h3 className="section-title">Order Summary</h3>
              {items.map((item) => (
                <div key={item.id} className="order-item-with-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <div className="item-name">
                      {item.name} x {item.quantity}
                    </div>
                    <div className="item-price">
                      ₹{item.quantity * item.discountedPrice}
                    </div>
                  </div>
                </div>
              ))}
              <div className="order-total">
                <span>Total</span>
                <span className="total-amount">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
