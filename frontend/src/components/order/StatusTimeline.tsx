import type { OrderStatus } from "../../utils/types";
import { ORDER_STATUS_LABELS } from "../../utils/staticData";
import "../../styles/order/statusTimeline.css";

const STATUS_STEPS: OrderStatus[] = [
  "ORDER_RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

interface StatusTimelineProps {
  status: OrderStatus;
}

export default function StatusTimeline({ status }: StatusTimelineProps) {
  const isCancelled = status === "CANCELLED";
  const currentIndex = isCancelled ? -1 : STATUS_STEPS.indexOf(status);

  // FIX: Use currentIndex + 1 so DELIVERED (index 3) gets progress-4 (100%)
  // ORDER_RECEIVED (index 0) gets progress-1 (25%), etc.
  const progressModifier = isCancelled
    ? " status-timeline-progress-cancelled"
    : currentIndex >= 0
      ? ` status-timeline-progress-${currentIndex + 1}`
      : "";

  return (
    <div className="status-timeline">
      {isCancelled && (
        <div className="status-cancelled-badge">
          <span className="status-cancelled-icon">✕</span>
          Order Cancelled
        </div>
      )}

      <div className="status-timeline-track" />
      <div className={`status-timeline-progress${progressModifier}`} />

      <div className="status-timeline-steps">
        {STATUS_STEPS.map((step, index) => {
          let circleState: "future" | "active" | "completed" | "cancelled" =
            "future";

          if (isCancelled) {
            circleState = "cancelled";
          } else if (index < currentIndex) {
            circleState = "completed";
          } else if (index === currentIndex) {
            circleState = "active";
          }

          // FIX: When DELIVERED (last step), mark it as completed, not active
          const isLastStep = index === STATUS_STEPS.length - 1;
          if (!isCancelled && isLastStep && index === currentIndex) {
            circleState = "completed";
          }

          let labelClass = "status-step-label";
          if (isCancelled) labelClass += " status-step-label-cancelled";
          else if (circleState === "active")
            labelClass += " status-step-label-active";
          else if (circleState === "completed")
            labelClass += " status-step-label-completed";

          const showCheckmark = circleState === "completed";

          return (
            <div key={step} className="status-step">
              <div
                className={`status-step-circle status-step-circle-${circleState}`}
              >
                {showCheckmark ? "✓" : index + 1}
              </div>
              <span className={labelClass}>{ORDER_STATUS_LABELS[step]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
