import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyState from '../common/EmptyState';
import '../../styles/cart/cartDrawer.css';

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isCartOpen = useUiStore((state) => state.isCartOpen);
  const toggleCart = useUiStore((state) => state.toggleCart);

  return (
    <div
      className={`cart-drawer-overlay ${isCartOpen ? 'cart-drawer-overlay-open' : ''}`}
      onClick={toggleCart}
      aria-hidden={!isCartOpen}
    >
      <aside
        className={`cart-drawer ${isCartOpen ? 'cart-drawer-open' : ''}`}
        onClick={(event) => event.stopPropagation()}
        aria-label="Shopping cart"
      >
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            Your Cart{' '}
            {totalItems > 0 && (
              <span className="cart-drawer-count">({totalItems})</span>
            )}
          </h2>
          <button
            className="cart-drawer-close"
            onClick={toggleCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-body">
            <EmptyState
              title="Your cart is empty"
              description="Add some delicious dishes to get started."
            />
          </div>
        ) : (
          <>
            <div className="cart-drawer-body">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
            <div className="cart-drawer-footer">
              <CartSummary />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
