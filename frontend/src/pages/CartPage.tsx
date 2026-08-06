import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/common/EmptyState";
import "../styles/cart/cartPage.css";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some delicious dishes to get started."
        actionLabel="Browse Menu"
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-content">
        <div className="cart-page-header">
          <h1 className="cart-page-title">Your Cart</h1>
          <button className="cart-page-clear" onClick={clearCart}>
            Clear all
          </button>
        </div>

        <div className="cart-page-items">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        <div className="cart-page-summary-wrapper">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
