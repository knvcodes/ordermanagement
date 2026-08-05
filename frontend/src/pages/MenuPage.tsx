import { useMemo, useState } from "react";
import CategoryFilter from "../components/menu/CategoryFilter";
import MenuGrid from "../components/menu/MenuGrid";
import "../styles/menu/menuPage.css";
import { useMenuData } from "@/service/menu/menu.providers";
import Spinner from "@/components/common/Spinner";
import { getRandomRating } from "@/utils/helpers";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { list, isLoading, error } = useMenuData();
  console.info("menuList:===>", { list, isLoading, error });

  const menuItems = useMemo(() => {
    return (list?.data || []).map(
      (item: { _id: any; id: any; rating: any; reviews: any }) => ({
        ...item,
        id: item._id || item.id,

        rating: item.rating ?? getRandomRating(), // Defaults to 4.5 if missing
        reviews: item.reviews ?? 128, // Defaults to 128 if missing
      }),
    );
  }, [list]);

  // 3. Filter based on search query
  const searchedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return menuItems;
    return menuItems.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(query),
    );
  }, [searchQuery, menuItems]);

  // 4. Handle Loading State
  if (isLoading) {
    return (
      <div className="menu-page">
        <section className="menu-page-hero">
          <h1 className="menu-page-title">Delicious food, delivered to you</h1>
          <p className="menu-page-subtitle">Loading our delicious menu...</p>
        </section>
        <Spinner />
      </div>
    );
  }

  // 5. Handle Error State
  if (error) {
    return (
      <div className="menu-page">
        <section className="menu-page-hero">
          <h1 className="menu-page-title">Delicious food, delivered to you</h1>
          <p className="menu-page-subtitle" style={{ color: "red" }}>
            Failed to load menu. Please try again later.
          </p>
        </section>
      </div>
    );
  }

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
