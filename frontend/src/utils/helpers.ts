import { useEffect, useState } from "react";
import type { CartItem, MenuItem, MenuItem2 } from "../utils/types";

/**
 * Formats a price in cents to a display string like "$14.99"
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Calculates the total cost of a single cart item (price × quantity) in cents
 */
export function calculateItemTotal(item: CartItem): number {
  return item.price * item.quantity;
}

/**
 * Calculates the total cost of all items in the cart in cents
 */
export function calculateCartTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

/**
 * Generates a unique order ID with timestamp prefix
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Groups menu items by their category into a record map
 */
export function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  return items.reduce<Record<string, MenuItem[]>>((groups, item) => {
    const key = item.category;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Filters menu items by category. Returns all items when category is 'All'.
 */
export function filterByCategory(
  items: MenuItem2[],
  category: string,
): MenuItem2[] {
  if (category === "All") return items;
  return items.filter((item) => item.category === category);
}

export const getRandomRating = (): number => {
  return parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1));
};

export const getRandomTime = (): string => {
  const minTime = 15;
  const maxTime = 45;
  const randomMinutes =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return `${randomMinutes} mins`;
};

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
