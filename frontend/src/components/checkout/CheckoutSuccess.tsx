import { useNavigate } from "react-router-dom";
import type { Order } from "../../utils/types";
import { formatPrice } from "../../utils/helpers";
import "../../styles/checkout/checkoutSuccess.css";

const DELIVERY_BUFFER_MINUTES = 15;

interface CheckoutSuccessProps {
  order: Order;
}

export default function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  const navigate = useNavigate();

  const maxPrepTime = order.items.reduce(
    (max: number, item: { prepTime: number }) => Math.max(max, item.prepTime),
    0,
  );
  const estimatedMinutes = maxPrepTime + DELIVERY_BUFFER_MINUTES;

  return (
    <div className="checkout-success-overlay">
      <div className="checkout-success">
        <div className="checkout-success-icon">✓</div>
        <h2 className="checkout-success-title">Order Confirmed!</h2>
        <p className="checkout-success-message">
          Thank you, {order.deliveryInfo.name}. Your food is being prepared.
        </p>

        <div className="checkout-success-details">
          <div className="checkout-success-row">
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>
          <div className="checkout-success-row">
            <span>Total Paid</span>
            <strong>{formatPrice(order.totalAmount)}</strong>
          </div>
          <div className="checkout-success-row">
            <span>Estimated Delivery</span>
            <strong>
              {estimatedMinutes}–{estimatedMinutes + 10} min
            </strong>
          </div>
        </div>

        <div className="checkout-success-actions">
          <button
            className="checkout-success-track"
            onClick={() => navigate("/track")}
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
