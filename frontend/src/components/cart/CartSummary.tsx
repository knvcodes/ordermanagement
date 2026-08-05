import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { calculateCartTotal, formatPrice } from "../../utils/helpers";
import "../../styles/cart/cartSummary.css";
import { useUiStore } from "@/store/uiStore";

const DELIVERY_FEE = 299; // cents
const TAX_RATE = 0.08;

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const subtotal = calculateCartTotal(items);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + tax;

  const toggleCart = useUiStore((state) => state.toggleCart);

  return (
    <div className="cart-summary">
      <div className="cart-summary-row">
        <span className="cart-summary-label">Subtotal</span>
        <span className="cart-summary-value">{formatPrice(subtotal)}</span>
      </div>

      <div className="cart-summary-row">
        <span className="cart-summary-label">Delivery Fee</span>
        <span className="cart-summary-value">{formatPrice(DELIVERY_FEE)}</span>
      </div>

      <div className="cart-summary-row">
        <span className="cart-summary-label">Tax (8%)</span>
        <span className="cart-summary-value">{formatPrice(tax)}</span>
      </div>

      <div className="cart-summary-divider" />

      <div className="cart-summary-row cart-summary-total">
        <span className="cart-summary-label">Total</span>
        <span className="cart-summary-value">{formatPrice(total)}</span>
      </div>

      <button
        className="cart-summary-checkout"
        onClick={() => {
          navigate("/checkout");
          toggleCart();
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
