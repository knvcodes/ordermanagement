import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { calculateItemTotal, formatPrice } from '../utils/helpers';
import StatusTimeline from '../components/order/StatusTimeline';
import LiveTracker from '../components/order/LiveTracker';
import EmptyState from '../components/common/EmptyState';
import '../styles/order/trackOrderPage.css';

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get('orderId');
  const orders = useOrderStore((state) => state.orders);
  const currentOrder = useOrderStore((state) => state.currentOrder);
  const [inputValue, setInputValue] = useState(paramId ?? '');

  useEffect(() => {
    setInputValue(paramId ?? '');
  }, [paramId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = inputValue.trim();
    if (id) {
      setSearchParams({ orderId: id });
    }
  };

  const paramOrder = paramId
    ? orders.find((order) => order.id === paramId) ?? null
    : null;
  const displayedOrder = paramId ? paramOrder : currentOrder;

  return (
    <div className="track-order-page">
      <h1 className="track-order-page-title">Track Your Order</h1>

      <form className="track-order-search" onSubmit={handleSubmit}>
        <input
          type="text"
          className="track-order-input"
          placeholder="Enter your order ID (e.g., ORD-XXXX)"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          aria-label="Order ID"
        />
        <button type="submit" className="track-order-submit">
          Track
        </button>
      </form>

      {displayedOrder ? (
        <div className="track-order-result">
          <div className="track-order-status-card">
            <LiveTracker order={displayedOrder} />
            <StatusTimeline status={displayedOrder.status} />
          </div>

          <div className="track-order-details">
            <h2 className="track-order-details-title">Order Details</h2>

            <div className="track-order-details-row">
              <span>Order ID</span>
              <strong>{displayedOrder.id}</strong>
            </div>
            <div className="track-order-details-row">
              <span>Deliver to</span>
              <strong>{displayedOrder.deliveryInfo.name}</strong>
            </div>
            <div className="track-order-details-row">
              <span>Address</span>
              <strong>{displayedOrder.deliveryInfo.address}</strong>
            </div>

            <div className="track-order-details-divider" />

            {displayedOrder.items.map((item) => (
              <div key={item.id} className="track-order-details-row">
                <span>
                  {item.quantity}× {item.name}
                </span>
                <strong>{formatPrice(calculateItemTotal(item))}</strong>
              </div>
            ))}

            <div className="track-order-details-divider" />

            <div className="track-order-details-row track-order-details-total">
              <span>Total</span>
              <strong>{formatPrice(displayedOrder.totalAmount)}</strong>
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
