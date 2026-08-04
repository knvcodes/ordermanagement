import { useEffect, useState } from "react";
import type { Order } from "../../utils/types";
import { ORDER_STATUS_LABELS } from "../../utils/staticData";
import "../../styles/order/liveTracker.css";

const ESTIMATED_TOTAL_SECONDS = 15;

interface LiveTrackerProps {
  order: Order;
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export default function LiveTracker({ order }: LiveTrackerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const createdAtMs = new Date(order.createdAt).getTime();
  const elapsedSeconds = Math.max(0, Math.floor((now - createdAtMs) / 1000));
  const isDelivered = order.status === "delivered";
  const remainingSeconds = isDelivered
    ? 0
    : Math.max(0, ESTIMATED_TOTAL_SECONDS - elapsedSeconds);

  return (
    <div className="live-tracker">
      <div className="live-tracker-status">
        <span className="live-tracker-dot">
          {!isDelivered && <span className="live-tracker-dot-ping" />}
          <span
            className={`live-tracker-dot-core ${
              isDelivered ? "live-tracker-dot-core-delivered" : ""
            }`}
          />
        </span>
        <span className="live-tracker-label">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="live-tracker-times">
        <div className="live-tracker-time">
          <span className="live-tracker-time-label">Elapsed</span>
          <span className="live-tracker-time-value">
            {formatDuration(elapsedSeconds)}
          </span>
        </div>
        <div className="live-tracker-time">
          <span className="live-tracker-time-label">Est. Remaining</span>
          <span className="live-tracker-time-value">
            {isDelivered ? "Done" : formatDuration(remainingSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
