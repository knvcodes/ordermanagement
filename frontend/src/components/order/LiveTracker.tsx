import type { OrderReal, OrderStatus } from "../../utils/types";
import { ORDER_STATUS_LABELS } from "../../utils/staticData";
import "../../styles/order/liveTracker.css";

interface LiveTrackerProps {
  order: OrderReal;
}

export default function LiveTracker({ order }: LiveTrackerProps) {
  const isDelivered = order.status === "DELIVERED";
  const isCancelled = order.status === "CANCELLED";
  const isTerminalState = isDelivered || isCancelled;

  return (
    <div className="live-tracker">
      <div className="live-tracker-status">
        <span className="live-tracker-dot">
          {!isTerminalState && <span className="live-tracker-dot-ping" />}
          <span
            className={`live-tracker-dot-core ${
              isDelivered ? "live-tracker-dot-core-delivered" : ""
            } ${isCancelled ? "live-tracker-dot-core-cancelled" : ""}`}
          />
        </span>
        <span className="live-tracker-label">
          {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
        </span>
      </div>
    </div>
  );
}
