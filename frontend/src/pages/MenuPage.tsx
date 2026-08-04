import { useMemo, useState } from 'react';
import { MENU_ITEMS } from '../utils/staticData';
import CategoryFilter from '../components/menu/CategoryFilter';
import MenuGrid from '../components/menu/MenuGrid';
import '../styles/menu/menuPage.css';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const searchedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return MENU_ITEMS;
    return MENU_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <div className="menu-page">
      <section className="menu-page-hero">
        <h1 className="menu-page-title">Delicious food, delivered to you</h1>
        <p className="menu-page-subtitle">
          Order from our kitchen to your door in minutes.
        </p>
        <div className="menu-page-search">
          <svg
            className="menu-page-search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            className="menu-page-search-input"
            placeholder="Search dishes by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search dishes by name"
          />
        </div>
      </section>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <MenuGrid items={searchedItems} selectedCategory={selectedCategory} />
    </div>
  );
}
