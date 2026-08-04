import { Link, NavLink } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import '../../styles/layout/header.css';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isMobileMenuOpen = useUiStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const toggleCart = useUiStore((state) => state.toggleCart);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          FoodDash
        </Link>

        <nav className="header-nav">
          <NavLink to="/" className="header-nav-link">Menu</NavLink>
          <NavLink to="/orders" className="header-nav-link">Orders</NavLink>
          <NavLink to="/track" className="header-nav-link">Track</NavLink>
        </nav>

        <div className="header-actions">
          <button className="header-cart-btn" onClick={toggleCart} aria-label="Open cart">
            <svg className="header-cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="header-cart-badge">{totalItems}</span>
            )}
          </button>

          <button className="header-hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span className="header-hamburger-line" />
            <span className="header-hamburger-line" />
            <span className="header-hamburger-line" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="header-mobile-nav">
          <NavLink to="/" className="header-mobile-link" onClick={toggleMobileMenu}>Menu</NavLink>
          <NavLink to="/orders" className="header-mobile-link" onClick={toggleMobileMenu}>Orders</NavLink>
          <NavLink to="/track" className="header-mobile-link" onClick={toggleMobileMenu}>Track</NavLink>
        </nav>
      )}
    </header>
  );
}
