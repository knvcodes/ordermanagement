import { useCartStore } from '../../store/cartStore';
import {
  calculateCartTotal,
  calculateItemTotal,
  formatPrice,
} from '../../utils/helpers';
import '../../styles/checkout/orderReview.css';

const DELIVERY_FEE = 299; // cents ($2.99)
const TAX_RATE = 0.08;
const DELIVERY_BUFFER_MINUTES = 15;

export default function OrderReview() {
  const items = useCartStore((state) => state.items);

  const subtotal = calculateCartTotal(items);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + tax;

  const maxPrepTime = items.reduce((max, item) => Math.max(max, item.prepTime), 0);
  const estimatedMinutes = maxPrepTime + DELIVERY_BUFFER_MINUTES;

  return (
    <aside className="order-review">
      <h2 className="order-review-title">Order Summary</h2>

      <ul className="order-review-items">
        {items.map((item) => (
          <li key={item.id} className="order-review-item">
            <span className="order-review-item-qty">{item.quantity}×</span>
            <span className="order-review-item-name">{item.name}</span>
            <span className="order-review-item-price">
              {formatPrice(calculateItemTotal(item))}
            </span>
          </li>
        ))}
      </ul>

      <div className="order-review-divider" />

      <div className="order-review-row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="order-review-row">
        <span>Delivery Fee</span>
        <span>{formatPrice(DELIVERY_FEE)}</span>
      </div>
      <div className="order-review-row">
        <span>Tax (8%)</span>
        <span>{formatPrice(tax)}</span>
      </div>

      <div className="order-review-divider" />

      <div className="order-review-row order-review-total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <div className="order-review-eta">
        <span>Estimated Delivery</span>
        <strong>
          {estimatedMinutes}–{estimatedMinutes + 10} min
        </strong>
      </div>
    </aside>
  );
}
