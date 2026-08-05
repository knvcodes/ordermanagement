import type { MenuItem2 } from "../../utils/types";
import { useCartStore } from "../../store/cartStore";
import {
  formatPrice,
  getRandomRating,
  getRandomTime,
} from "../../utils/helpers";
import "../../styles/menu/foodCard.css";

const CATEGORY_ICONS: Record<string, string> = {
  Pizza: "🍕",
  Burger: "🍔",
  Pasta: "🍝",
  Salad: "🥗",
  Dessert: "🍰",
  Drink: "🥤",
};

interface FoodCardProps {
  item: MenuItem2;
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.round(rating);
  return (
    <div className="food-card-stars" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < fullStars ? "star-filled" : "star-empty"}>
          ★
        </span>
      ))}
      <span className="food-card-rating-value">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function FoodCard({ item }: FoodCardProps) {
  const cartItem = useCartStore((state) =>
    state.items.find((i) => i._id === item._id),
  );
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const categoryClass = `food-card-image-${item.category.toLowerCase()}`;

  return (
    <article className="food-card">
      <div className={`food-card-image ${categoryClass}`}>
        <span className="food-card-icon" role="img" aria-label={item.category}>
          {CATEGORY_ICONS[item.category] ?? "🍽️"}
        </span>
        <span className="food-card-prep-time">{getRandomTime()}</span>
      </div>

      <div className="food-card-body">
        <h3 className="food-card-name">{item.name}</h3>
        <p className="food-card-description">{item.description}</p>
        <RatingStars rating={getRandomRating()} />

        <div className="food-card-footer">
          <span className="food-card-price">{formatPrice(item.price)}</span>

          {cartItem ? (
            <div className="food-card-stepper">
              <button
                className="stepper-btn"
                onClick={() => updateQuantity(item._id, cartItem.quantity - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="stepper-value">{cartItem.quantity}</span>
              <button
                className="stepper-btn"
                onClick={() => addItem(item)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button className="food-card-add-btn" onClick={() => addItem(item)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
