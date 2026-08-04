import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Toast from './Toast';
import CartDrawer from '../cart/CartDrawer';
import '../../styles/layout/layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">{children}</main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}
