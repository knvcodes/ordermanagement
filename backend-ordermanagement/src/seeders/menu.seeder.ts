// seeder/menu.seeder.js

import Menu from "../modules/menu/menu.model.js";

const STATIC_MENU = [
  {
    name: "Margherita Pizza",
    description:
      "Classic pizza topped with fresh mozzarella, tomato sauce, and basil.",
    price: 299,
    image: "/images/menu/margherita.jpg",
    category: "Pizza",
    isAvailable: true,
  },
  {
    name: "Veggie Burger",
    description: "Grilled vegetable patty with lettuce, tomato, and cheese.",
    price: 199,
    image: "/images/menu/veggie-burger.jpg",
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "Chicken Burger",
    description: "Juicy grilled chicken patty with fresh vegetables and mayo.",
    price: 249,
    image: "/images/menu/chicken-burger.jpg",
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "French Fries",
    description: "Golden crispy potato fries served with ketchup.",
    price: 99,
    image: "/images/menu/fries.jpg",
    category: "Sides",
    isAvailable: true,
  },
  {
    name: "Garlic Bread",
    description: "Freshly baked garlic bread with herbs and butter.",
    price: 129,
    image: "/images/menu/garlic-bread.jpg",
    category: "Sides",
    isAvailable: true,
  },
  {
    name: "Caesar Salad",
    description:
      "Fresh lettuce, parmesan cheese, croutons, and Caesar dressing.",
    price: 179,
    image: "/images/menu/caesar-salad.jpg",
    category: "Salad",
    isAvailable: true,
  },
  {
    name: "Paneer Tikka",
    description: "Grilled paneer cubes marinated in Indian spices.",
    price: 249,
    image: "/images/menu/paneer-tikka.jpg",
    category: "Starter",
    isAvailable: true,
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant basmati rice cooked with spicy chicken.",
    price: 349,
    image: "/images/menu/chicken-biryani.jpg",
    category: "Main Course",
    isAvailable: true,
  },
  {
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie served warm.",
    price: 149,
    image: "/images/menu/brownie.jpg",
    category: "Dessert",
    isAvailable: true,
  },
  {
    name: "Cold Coffee",
    description: "Creamy chilled coffee topped with whipped cream.",
    price: 129,
    image: "/images/menu/cold-coffee.jpg",
    category: "Beverage",
    isAvailable: true,
  },
  {
    name: "Lemonade",
    description: "Refreshing homemade lemonade with mint.",
    price: 79,
    image: "/images/menu/lemonade.jpg",
    category: "Beverage",
    isAvailable: false,
  },
];

export async function seedMenu() {
  try {
    await Menu.deleteMany({});
    console.log("🗑️ Cleared existing menu");

    await Menu.insertMany(STATIC_MENU);

    console.log(`✅ Seeded ${STATIC_MENU.length} menu items`);
  } catch (error) {
    console.error("❌ Menu seeder failed:", error);
    throw error;
  }
}
