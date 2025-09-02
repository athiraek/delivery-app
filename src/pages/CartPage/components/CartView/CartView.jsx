import React from "react";
import { useStore } from "../../../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabase-client";
import "./CartView.css";

const CartView = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useStore();

  const items = Object.values(cartItems);

  const totalOriginal = items.reduce(
    (acc, item) => acc + ((item.originalPrice || 0) * (item.quantity || 0)),
    0
  );
  const totalDiscount = items.reduce(
    (acc, item) =>
      acc +
      (((item.originalPrice || 0) - (item.discountedPrice || 0)) *
        (item.quantity || 0)),
    0
  );
  const totalAmount =
    items.reduce(
      (acc, item) =>
        acc + ((item.discountedPrice || item.originalPrice || 0) * (item.quantity || 0)),
      0
    ) + 4;

  async function handlePlaceOrder() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      navigate("/signin?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  }

  return (
    <div className="container my-4">
      <div className="row">
        {/* Cart Items */}
        <div className="col-12 col-lg-8 mb-4">
          {items.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div className="card mb-3" key={item.id}>
                <div className="card-body d-flex flex-column flex-md-row align-items-start gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img img-fluid rounded"
                  />

                  <div className="flex-grow-1">
                    <h5>{item.name}</h5>
                    <p className="text-muted mb-2">{item.description}</p>

                    <div className="d-flex align-items-center my-2">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-2">
                      <button
                        className="btn btn-link text-danger p-0"
                        onClick={() => removeFromCart(item.id)}
                      >
                        REMOVE
                      </button>
                      <button className="btn btn-link p-0">
                        SAVE FOR LATER
                      </button>
                    </div>
                  </div>

                  <div className="text-end ms-auto">
                    {item.discountedPrice && item.discountedPrice < item.originalPrice && (
                      <div className="text-muted text-decoration-line-through">
                        ₹{item.originalPrice * item.quantity}
                      </div>
                    )}
                    <h5 className="text-success">
                      ₹{(item.discountedPrice || item.originalPrice) * item.quantity}
                    </h5>
                    {item.discount && (
                      <small className="text-success">{item.discount}% Off</small>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="d-grid d-md-block">
              <button
                className="btn btn-warning w-100 w-md-auto mt-3"
                onClick={handlePlaceOrder}
              >
                PLACE ORDER
              </button>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-header">
              <strong>PRICE DETAILS</strong>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span>Price ({items.length} items)</span>
                <span>₹{totalOriginal}</span>
              </div>
              <div className="d-flex justify-content-between text-success">
                <span>Discount</span>
                <span>-₹{totalDiscount}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Platform Fee</span>
                <span>₹4</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
              <p className="text-success mt-2 mb-0">
                You will save ₹{totalDiscount} on this order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
