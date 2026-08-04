import { useNavigate } from "react-router-dom";
import type { Order, OrderStatus } from "../../utils/types";
import { ORDER_STATUS_LABELS } from "../../utils/staticData";
import { formatPrice } from "../../utils/helpers";
import "../../styles/order/orderCard.css";

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  received: "order-card-badge-received",
  preparing: "order-card-badge-preparing",
  out_for_delivery: "order-card-badge-out-for-delivery",
  delivered: "order-card-badge-delivered",
};

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const formattedDate = new Date(order.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="order-card">
      <div className="order-card-header">
        <div>
          <h3 className="order-card-id">{order.id}</h3>
          <span className="order-card-date">{formattedDate}</span>
        </div>
        <span
          className={`order-card-badge ${STATUS_BADGE_CLASSES[order.status]}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <p className="order-card-items">
        {totalItems} {totalItems === 1 ? "item" : "items"} —{" "}
        {order.items.map((item) => item.name).join(", ")}
      </p>

      <div className="order-card-footer">
        <span className="order-card-total">
          {formatPrice(order.totalAmount)}
        </span>
        <button
          className="order-card-track-btn"
          onClick={() => navigate(`/track?orderId=${order.id}`)}
        >
          Track
        </button>
      </div>
    </article>
  );
}
