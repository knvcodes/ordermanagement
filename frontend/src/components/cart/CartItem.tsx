import type { CartItem as CartItemType } from "../../utils/types";
import { useCartStore } from "../../store/cartStore";
import { calculateItemTotal, formatPrice } from "../../utils/helpers";
import "../../styles/cart/cartItem.css";

const CATEGORY_ICONS: Record<string, string> = {
  Pizza: "🍕",
  Burger: "🍔",
  Pasta: "🍝",
  Salad: "🥗",
  Dessert: "🍰",
  Drink: "🥤",
};

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="cart-item">
      <div
        className={`cart-item-image cart-item-image-${item.category.toLowerCase()}`}
      >
        <span className="cart-item-icon" role="img" aria-label={item.category}>
          {CATEGORY_ICONS[item.category] ?? "🍽️"}
        </span>
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <span className="cart-item-price-each">
          {formatPrice(item.price)} each
        </span>

        <div className="cart-item-controls">
          <div className="cart-item-stepper">
            <button
              className="cart-item-step-btn"
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              aria-label={`Decrease ${item.name} quantity`}
            >
              −
            </button>
            <span className="cart-item-step-value">{item.quantity}</span>
            <button
              className="cart-item-step-btn"
              onClick={() => addItem(item)}
              aria-label={`Increase ${item.name} quantity`}
            >
              +
            </button>
          </div>

          <span className="cart-item-total">
            {formatPrice(calculateItemTotal(item))}
          </span>
        </div>
      </div>

      <button
        className="cart-item-remove"
        onClick={() => removeItem(item._id)}
        aria-label={`Remove ${item.name} from cart`}
      >
        ×
      </button>
    </div>
  );
}
