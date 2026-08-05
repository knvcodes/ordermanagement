import { useNavigate } from "react-router-dom";
import type { OrderPlacedData } from "../../utils/types";
import { formatPrice, getRandomTime } from "../../utils/helpers";
import "../../styles/checkout/checkoutSuccess.css";

interface CheckoutSuccessProps {
  order: OrderPlacedData;
}

export default function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  const navigate = useNavigate();

  const maxPrepTime = getRandomTime();

  return (
    <div className="checkout-success-overlay">
      <div className="checkout-success">
        <div className="checkout-success-icon">✓</div>
        <h2 className="checkout-success-title">Order Confirmed!</h2>
        <p className="checkout-success-message">
          Thank you, Your food is being prepared.
        </p>

        <div className="checkout-success-details">
          <div className="checkout-success-row">
            <span>Order ID</span>
            <strong>{order._id}</strong>
          </div>
          <div className="checkout-success-row">
            <span>Total Paid</span>
            <strong>{formatPrice(order.totalAmount)}</strong>
          </div>
          <div className="checkout-success-row">
            <span>Estimated Delivery</span>
            <strong>{maxPrepTime}</strong>
          </div>
        </div>

        <div className="checkout-success-actions">
          <button
            className="checkout-success-track"
            onClick={() => navigate(`/track?orderId=${order._id}`)}
          >
            Track Order
          </button>
          <button
            className="checkout-success-menu"
            onClick={() => navigate("/")}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
