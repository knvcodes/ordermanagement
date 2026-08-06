import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import LiveTracker from "@/components/order/LiveTracker";
import StatusTimeline from "@/components/order/StatusTimeline";
import { useOrderDetailsData } from "@/service/orders/orders.providers";
import { ORDER_STATUS_LABELS } from "@/utils/staticData";
import type { OrderStatus } from "@/utils/types";
import "../styles/order/changeOrderStatusPage.css";

interface OrderIdFormInputs {
  orderId: string;
}

interface StatusFormInputs {
  status: OrderStatus;
}

const ORDER_STATUSES = Object.entries(ORDER_STATUS_LABELS) as [
  OrderStatus,
  string,
][];

export default function ChangeOrderStatusPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const [successMessage, setSuccessMessage] = useState("");
  const {
    orderDetail,
    isLoading,
    error,
    updateOrderStatus,
    isUpdatingStatus,
    updateStatusError,
  } = useOrderDetailsData(orderId);

  const orderIdForm = useForm<OrderIdFormInputs>({
    defaultValues: { orderId },
  });
  const statusForm = useForm<StatusFormInputs>({
    defaultValues: { status: "ORDER_RECEIVED" },
  });

  useEffect(() => {
    orderIdForm.setValue("orderId", orderId);
  }, [orderId, orderIdForm]);

  useEffect(() => {
    if (orderDetail) {
      statusForm.setValue("status", orderDetail.status);
    }
  }, [orderDetail, statusForm]);

  const findOrder = ({ orderId: submittedOrderId }: OrderIdFormInputs) => {
    setSuccessMessage("");
    setSearchParams({ orderId: submittedOrderId.trim() });
  };

  const changeStatus = async ({ status }: StatusFormInputs) => {
    if (!orderDetail) return;

    setSuccessMessage("");
    try {
      await updateOrderStatus({ orderId: orderDetail._id, status });
      setSuccessMessage(`Order status changed to ${ORDER_STATUS_LABELS[status]}.`);
    } catch {
      // Mutation error is shown below the form.
    }
  };

  return (
    <div className="change-order-status-page">
      <h1 className="change-order-status-page-title">Change Order Status</h1>
      <p className="change-order-status-page-description">
        Find an order, then select its current fulfillment status.
      </p>

      <form
        className="change-order-status-search"
        onSubmit={orderIdForm.handleSubmit(findOrder)}
      >
        <div className="change-order-status-field">
          <input
            type="text"
            className="change-order-status-input"
            placeholder="Enter 24-character Order ID (e.g., 6a72fd...)"
            aria-label="Order ID"
            {...orderIdForm.register("orderId", {
              required: "Order ID is required",
              validate: (value) =>
                /^[0-9a-fA-F]{24}$/.test(value.trim()) ||
                "Enter a 24-character hexadecimal order ID",
            })}
          />
          {orderIdForm.formState.errors.orderId && (
            <span className="change-order-status-error">
              {orderIdForm.formState.errors.orderId.message}
            </span>
          )}
        </div>
        <button type="submit" className="change-order-status-submit" disabled={isLoading}>
          {isLoading ? "Finding..." : "Find Order"}
        </button>
      </form>

      {isLoading ? (
        <div className="change-order-status-card">Loading order details...</div>
      ) : error ? (
        <EmptyState
          title="Error loading order"
          description="Check the order ID and try again."
        />
      ) : orderDetail ? (
        <div className="change-order-status-result">
          <div className="change-order-status-card">
            <LiveTracker order={orderDetail} />
            <StatusTimeline status={orderDetail.status} />
          </div>

          <form
            className="change-order-status-card change-order-status-form"
            onSubmit={statusForm.handleSubmit(changeStatus)}
          >
            <div>
              <h2 className="change-order-status-form-title">Update status</h2>
              <p className="change-order-status-form-description">
                Order ID: <strong>{orderDetail._id}</strong>
              </p>
            </div>
            <label className="change-order-status-label" htmlFor="order-status">
              New status
            </label>
            <select
              id="order-status"
              className="change-order-status-select"
              {...statusForm.register("status")}
            >
              {ORDER_STATUSES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {updateStatusError && (
              <p className="change-order-status-error" role="alert">
                Unable to update the order status. Please try again.
              </p>
            )}
            {successMessage && (
              <p className="change-order-status-success" role="status">
                {successMessage}
              </p>
            )}
            <button
              type="submit"
              className="change-order-status-submit"
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </button>
          </form>
        </div>
      ) : orderId ? (
        <EmptyState title="Order not found" description={`No order was found with ID "${orderId}".`} />
      ) : (
        <EmptyState
          title="Find an order"
          description="Enter an order ID above to update its status."
        />
      )}
    </div>
  );
}
