import { useLocation, Link } from "react-router-dom";
import "./OrderSuccess.css";


const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="success-container">
      <h2>🎉 Order Confirmed!</h2>
      <p>Order ID: {order?.id}</p>
      <Link to="/user/orders">View My Orders</Link>
    </div>
  );
};

export default OrderSuccess;
