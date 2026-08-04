import { CATEGORIES } from '../../utils/staticData';
import '../../styles/menu/categoryFilter.css';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="category-filter" role="tablist" aria-label="Filter by category">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          role="tab"
          aria-selected={selectedCategory === category}
          className={`category-pill ${
            selectedCategory === category ? 'category-pill-active' : ''
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
