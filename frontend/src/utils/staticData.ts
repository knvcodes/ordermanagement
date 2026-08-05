import type { MenuItem, OrderStatus } from "../utils/types";

export const CATEGORIES = [
  "All",
  "Pizza",
  "Burger",
  "Pasta",
  "Salad",
  "Dessert",
  "Drink",
] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "Order Received",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "piz-001",
    name: "Margherita Classica",
    description:
      "San Marzano tomato sauce, fresh mozzarella, basil, extra virgin olive oil on hand-tossed dough.",
    price: 1499,
    category: "Pizza",
    image: "/images/margherita.jpg",
    rating: 4.7,
    prepTime: 20,
  },
  {
    id: "piz-002",
    name: "Diavola Spicy",
    description:
      "Spicy salami, roasted red peppers, chili flakes, mozzarella, and tomato sauce.",
    price: 1799,
    category: "Pizza",
    image: "/images/diavola.jpg",
    rating: 4.5,
    prepTime: 22,
  },
  {
    id: "brg-001",
    name: "Smash Burger Deluxe",
    description:
      "Double smashed beef patties, American cheese, pickles, caramelized onions, secret sauce on brioche bun.",
    price: 1599,
    category: "Burger",
    image: "/images/smash-burger.jpg",
    rating: 4.8,
    prepTime: 15,
  },
  {
    id: "brg-002",
    name: "Truffle Mushroom Burger",
    description:
      "Grass-fed beef, sautéed wild mushrooms, Swiss cheese, truffle aioli, arugula.",
    price: 1899,
    category: "Burger",
    image: "/images/truffle-burger.jpg",
    rating: 4.6,
    prepTime: 18,
  },
  {
    id: "pas-001",
    name: "Carbonara Romana",
    description:
      "Rigatoni with guanciale, pecorino romano, egg yolk, black pepper. No cream, authentic style.",
    price: 1699,
    category: "Pasta",
    image: "/images/carbonara.jpg",
    rating: 4.9,
    prepTime: 18,
  },
  {
    id: "pas-002",
    name: "Pesto Genovese",
    description:
      "Fresh basil pesto, pine nuts, parmesan, green beans, and potatoes over trofie pasta.",
    price: 1549,
    category: "Pasta",
    image: "/images/pesto.jpg",
    rating: 4.4,
    prepTime: 15,
  },
  {
    id: "sal-001",
    name: "Mediterranean Bowl",
    description:
      "Mixed greens, chickpeas, feta, kalamata olives, cucumber, cherry tomatoes, lemon herb vinaigrette.",
    price: 1399,
    category: "Salad",
    image: "/images/mediterranean-bowl.jpg",
    rating: 4.5,
    prepTime: 10,
  },
  {
    id: "sal-002",
    name: "Thai Crunch Salad",
    description:
      "Napa cabbage, mango, edamame, crispy wontons, cilantro, spicy peanut lime dressing.",
    price: 1449,
    category: "Salad",
    image: "/images/thai-crunch.jpg",
    rating: 4.3,
    prepTime: 10,
  },
  {
    id: "des-001",
    name: "Tiramisu Classico",
    description:
      "Layers of espresso-soaked ladyfingers, mascarpone cream, cocoa powder. Made fresh daily.",
    price: 999,
    category: "Dessert",
    image: "/images/tiramisu.jpg",
    rating: 4.8,
    prepTime: 5,
  },
  {
    id: "des-002",
    name: "Lemon Ricotta Cake",
    description:
      "Light ricotta cake with Meyer lemon zest, vanilla bean, dusted with powdered sugar.",
    price: 899,
    category: "Dessert",
    image: "/images/lemon-cake.jpg",
    rating: 4.6,
    prepTime: 5,
  },
  {
    id: "drk-001",
    name: "Fresh Mango Lassi",
    description:
      "Creamy yogurt blended with Alphonso mango, cardamom, and a hint of saffron.",
    price: 699,
    category: "Drink",
    image: "/images/mango-lassi.jpg",
    rating: 4.7,
    prepTime: 5,
  },
  {
    id: "drk-002",
    name: "Cold Brew Tonic",
    description:
      "House cold brew coffee over ice with premium tonic water and orange peel garnish.",
    price: 599,
    category: "Drink",
    image: "/images/cold-brew-tonic.jpg",
    rating: 4.4,
    prepTime: 3,
  },
];
