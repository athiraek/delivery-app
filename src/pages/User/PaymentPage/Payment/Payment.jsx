import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabase-client";
import { useStore } from "../../../../Context/StoreContext";
import { useState } from "react";
import "./Payment.css";
import qr from '../../../../assets/images/qr.jpg';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useStore();
  const { items, buyNowItem, address, total } = location.state || {};

  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [screenshot, setScreenshot] = useState(null);

  const handleScreenshotChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handlePaymentSuccess = async () => {
    setIsPaying(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login", { state: { from: "/payment" } });
      setIsPaying(false);
      return;
    }

    let screenshotUrl = null;

    // QR Payment: Upload screenshot and get public URL
    if (paymentMethod === "qr") {
      if (!screenshot) {
        alert("Please upload payment screenshot to confirm QR payment.");
        setIsPaying(false);
        return;
      }

      const fileExt = screenshot.name.split(".").pop();
      const fileName = `payment-${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(fileName, screenshot);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload screenshot");
        setIsPaying(false);
        return;
      }

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("URL generation error:", urlError);
        setIsPaying(false);
        return;
      }

      screenshotUrl = publicUrlData.publicUrl; // <-- automatically stores URL
    }

    // Insert order with screenshot URL
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        created_at: new Date(),
        address: JSON.stringify(address),
        total_price: total,
        payment_method: paymentMethod,
        payment_status: "pending",
        payment_screenshot: screenshotUrl,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      alert("Failed to create order");
      setIsPaying(false);
      return;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_id: item.id,
      quantity: item.quantity,
      price: item.discountedPrice,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      alert("Failed to add order items");
      setIsPaying(false);
      return;
    }

    // Clear cart if not Buy Now
    if (!buyNowItem) clearCart();

    setIsPaying(false);
    navigate("/order-success", { state: { order } });
  };

  return (
    <div className="payment-container">
      <h2>Payment Page</h2>
      <p>Total Amount: ₹{total}</p>

      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            value="qr"
            checked={paymentMethod === "qr"}
            onChange={() => setPaymentMethod("qr")}
          />
          QR Code Payment
        </label>
      </div>

      {paymentMethod === "qr" && (
        <div className="qr-code-section">
          <p>Scan to pay:</p>
          <img src={qr} alt="QR Code" style={{ width: "200px", height: "200px" }} />

          <p>Upload payment screenshot:</p>
          <input type="file" accept="image/*" onChange={handleScreenshotChange} />

          {screenshot && (
            <div style={{ marginTop: "10px" }}>
              <p>Preview:</p>
              <img
                src={URL.createObjectURL(screenshot)}
                alt="Preview"
                style={{ width: "150px" }}
              />
            </div>
          )}
        </div>
      )}

      <button
        onClick={handlePaymentSuccess}
        disabled={isPaying}
        className="pay-btn"
      >
        {isPaying ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Payment;
