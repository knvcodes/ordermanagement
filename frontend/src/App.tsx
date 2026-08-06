import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MenuPage from '@/pages/MenuPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import TrackOrderPage from '@/pages/TrackOrderPage';
import ChangeOrderStatusPage from '@/pages/ChangeOrderStatusPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track/:orderId?" element={<TrackOrderPage />} />
          <Route path="/change-status" element={<ChangeOrderStatusPage />} />
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
