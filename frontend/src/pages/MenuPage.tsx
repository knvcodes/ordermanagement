import { useMemo, useState, useRef, useCallback } from "react";
import CategoryFilter from "../components/menu/CategoryFilter";
import MenuGrid from "../components/menu/MenuGrid";
import "../styles/menu/menuPage.css";
import { useMenuData } from "@/service/menu/menu.providers";
import Spinner from "@/components/common/Spinner";
import { getRandomRating, useDebounce } from "@/utils/helpers";
import { MenuItem2 } from "@/utils/types";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 800);

  const {
    list,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMenuData({
    search: debouncedSearch || undefined,
    category: selectedCategory,
  });

  // ✅ IntersectionObserver to trigger next page fetch
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const menuItems = useMemo(() => {
    // ✅ list is now a FLATTENED array (no more list.data)
    if (list && list.length > 0) {
      return list.map((item: MenuItem2) => ({
        ...item,
        id: item._id,
        rating: getRandomRating(),
        reviews: 128,
      }));
    }
    return [];
  }, [list]);

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

      <MenuGrid items={menuItems} selectedCategory={selectedCategory} />

      {/* ✅ Sentinel element — triggers next page when scrolled into view */}
      <div ref={sentinelRef} style={{ height: "1px" }} />

      {isFetchingNextPage && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Spinner />
        </div>
      )}

      {!hasNextPage && menuItems.length > 0 && (
        <p style={{ textAlign: "center", color: "#888", padding: "20px" }}>
          You've reached the end of the menu!
        </p>
      )}
    </div>
  );
}
