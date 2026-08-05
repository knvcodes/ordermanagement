import type { MenuItem } from "../../utils/types";
import { filterByCategory } from "../../utils/helpers";
import FoodCard from "./FoodCard";
import EmptyState from "../common/EmptyState";
import "../../styles/menu/menuGrid.css";

interface MenuGridProps {
  items: MenuItem[];
  selectedCategory: string;
}

export default function MenuGrid({ items, selectedCategory }: MenuGridProps) {
  const filteredItems = filterByCategory(items, selectedCategory);

  if (filteredItems.length === 0) {
    return (
      <EmptyState
        title="No dishes found"
        description="Try a different category or search term."
      />
    );
  }

  return (
    <div className="menu-grid">
      {filteredItems.map((item) => (
        // Fallback to _id if id is missing from the mapped object
        <FoodCard key={item.id} item={item} />
      ))}
    </div>
  );
}
