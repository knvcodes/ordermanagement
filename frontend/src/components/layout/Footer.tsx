import { Link } from 'react-router-dom';
import '../../styles/layout/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">FoodDash</span>
          <p className="footer-tagline">Delicious food, delivered fast.</p>
        </div>
        <div className="footer-links">
          <Link to="/" className="footer-link">Menu</Link>
          <Link to="/orders" className="footer-link">Orders</Link>
          <Link to="/track" className="footer-link">Track Order</Link>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} FoodDash. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
