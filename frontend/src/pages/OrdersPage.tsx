import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import OrderCard from "../components/order/OrderCard";
import EmptyState from "../components/common/EmptyState";
import "../styles/order/ordersPage.css";
import { useOrderData } from "@/service/orders/orders.providers";

export default function OrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const navigate = useNavigate();

  const orderState = useOrderData();
  console.info("orderState:===>", orderState);

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place an order, it will show up here."
        actionLabel="Browse Menu"
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-page-title">Your Orders</h1>
      <div className="orders-page-list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
