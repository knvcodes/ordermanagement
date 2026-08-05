import { useNavigate } from "react-router-dom";
import OrderCard from "../components/order/OrderCard";
import EmptyState from "../components/common/EmptyState";
import "../styles/order/ordersPage.css";
import { useOrderData } from "@/service/orders/orders.providers";

export default function OrdersPage() {
  const navigate = useNavigate();

  const orderState = useOrderData();
  console.info("orderState:===>", orderState.orders);

  if (orderState.orders.length === 0) {
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
        {orderState.orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
