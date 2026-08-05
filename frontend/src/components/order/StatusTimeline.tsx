import type { OrderStatus } from "../../utils/types";
import { ORDER_STATUS_LABELS } from "../../utils/staticData";
import "../../styles/order/statusTimeline.css";

const STATUS_STEPS: OrderStatus[] = [
  "ORDER_RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

interface StatusTimelineProps {
  status: OrderStatus;
}

export default function StatusTimeline({ status }: StatusTimelineProps) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  const progressModifier =
    currentIndex > 0 ? ` status-timeline-progress-${currentIndex}` : "";

  return (
    <div className="status-timeline">
      <div className="status-timeline-track" />
      <div className={`status-timeline-progress${progressModifier}`} />

      <div className="status-timeline-steps">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          let circleState = "future";
          if (isCompleted) circleState = "completed";
          else if (isActive) circleState = "active";

          let labelClass = "status-step-label";
          if (isActive) labelClass += " status-step-label-active";
          else if (isCompleted) labelClass += " status-step-label-completed";

          return (
            <div key={step} className="status-step">
              <div
                className={`status-step-circle status-step-circle-${circleState}`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span className={labelClass}>{ORDER_STATUS_LABELS[step]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
