import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { formatPrice } from "../utils/helpers";
import StatusTimeline from "../components/order/StatusTimeline";
import LiveTracker from "../components/order/LiveTracker";
import EmptyState from "../components/common/EmptyState";
import "../styles/order/trackOrderPage.css";
import { useOrderDetailsData } from "@/service/orders/orders.providers";
import { useOrderSSE } from "@/hooks/useSSE";

interface TrackFormInputs {
  orderId: string;
}

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get("orderId");

  // SSE hook — all real-time logic lives here
  const { liveStatus, isConnected } = useOrderSSE(paramId);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrackFormInputs>({
    defaultValues: {
      orderId: paramId ?? "",
    },
  });

  // Sync form value if URL param changes
  useEffect(() => {
    setValue("orderId", paramId ?? "");
  }, [paramId, setValue]);

  // Handle valid form submission
  const onSubmit = (data: TrackFormInputs) => {
    const trimmedId = data.orderId.trim();
    setSearchParams({ orderId: trimmedId });
  };

  // Fetch data from the API hook
  const { orderDetail, isLoading, error } = useOrderDetailsData(paramId || "");

  // Use live status if available, otherwise use fetched data
  const displayStatus = liveStatus || orderDetail?.status || null;

  return (
    <div className="track-order-page">
      <h1 className="track-order-page-title">Track Your Order</h1>

      {/* Live connection indicator */}
      {paramId && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1rem",
            fontSize: "0.85rem",
            color: isConnected ? "#22c55e" : "#ef4444",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isConnected ? "#22c55e" : "#ef4444",
              display: "inline-block",
            }}
          />
          {isConnected
            ? "Live tracking active"
            : "Connecting to live updates..."}
        </div>
      )}

      <form className="track-order-search" onSubmit={handleSubmit(onSubmit)}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            className="track-order-input"
            placeholder="Enter 24-character Order ID (e.g., 6a72fd...)"
            {...register("orderId", {
              required: "Order ID is required",
              validate: (val) =>
                /^[0-9a-fA-F]{24}$/.test(val.trim()) ||
                "Invalid format: must be a 24-character hexadecimal string",
            })}
            aria-label="Order ID"
          />
          {errors.orderId && (
            <span
              className="track-order-error"
              style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}
            >
              {errors.orderId.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="track-order-submit"
          disabled={isLoading}
        >
          {isLoading ? "Tracking..." : "Track"}
        </button>
      </form>

      {isLoading ? (
        <div className="track-order-result">
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Loading order details...
          </p>
        </div>
      ) : error ? (
        <EmptyState
          title="Error loading order"
          description="There was an error fetching your order details. Please check the ID and try again."
        />
      ) : orderDetail ? (
        <div className="track-order-result">
          <div className="track-order-status-card">
            <LiveTracker order={orderDetail} />
            {displayStatus && <StatusTimeline status={displayStatus} />}
          </div>

          <div className="track-order-details">
            <h2 className="track-order-details-title">Order Details</h2>

            <div className="track-order-details-row">
              <span>Order ID</span>
              <strong>{orderDetail._id}</strong>
            </div>
            <div className="track-order-details-row">
              <span>Deliver to</span>
              <strong>{orderDetail.delivery.name}</strong>
            </div>
            <div className="track-order-details-row">
              <span>Address</span>
              <strong>{orderDetail.delivery.address}</strong>
            </div>

            <div className="track-order-details-divider" />

            {orderDetail.items.map((item) => (
              <div key={item._id} className="track-order-details-row">
                <span>
                  {item.quantity}× {item.itemName}
                </span>
                <strong>{formatPrice(item.itemPrice * item.quantity)}</strong>
              </div>
            ))}

            <div className="track-order-details-divider" />

            <div className="track-order-details-row track-order-details-total">
              <span>Total</span>
              <strong>{formatPrice(orderDetail.totalAmount)}</strong>
            </div>
          </div>
        </div>
      ) : paramId ? (
        <EmptyState
          title="Order not found"
          description={`We couldn't find an order with ID "${paramId}".`}
        />
      ) : (
        <EmptyState
          title="Track an order"
          description="Enter your order ID above to see its live status."
        />
      )}
    </div>
  );
}
