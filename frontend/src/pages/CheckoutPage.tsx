import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import type { DeliveryInfo, Order } from "../utils/types";
import type { DeliveryFormData } from "../validations/order";
import DeliveryForm from "../components/checkout/DeliveryForm";
import OrderReview from "../components/checkout/OrderReview";
import CheckoutSuccess from "../components/checkout/CheckoutSuccess";
import EmptyState from "../components/common/EmptyState";
import "../styles/checkout/checkoutPage.css";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const navigate = useNavigate();

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (items.length === 0 && !placedOrder) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some items before checking out."
        actionLabel="Browse Menu"
        onAction={() => navigate("/")}
      />
    );
  }

  const handleSubmit = (data: DeliveryFormData) => {
    const deliveryInfo: DeliveryInfo = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      notes: data.notes,
    };
    const order = placeOrder(items, deliveryInfo);
    clearCart();
    setPlacedOrder(order);
  };

  if (placedOrder) {
    return <CheckoutSuccess order={placedOrder} />;
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page-title">Checkout</h1>
      <div className="checkout-page-grid">
        <div className="checkout-page-form">
          <DeliveryForm onSubmit={handleSubmit} />
        </div>
        <div className="checkout-page-review">
          <OrderReview />
        </div>
      </div>
    </div>
  );
}
