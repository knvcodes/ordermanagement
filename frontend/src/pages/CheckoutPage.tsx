import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import type {
  DeliveryInfo,
  OrderPayload,
  OrderPlacedData,
  OrderPlaceResponse,
} from "../utils/types";
import type { DeliveryFormData } from "../validations/order";
import DeliveryForm from "../components/checkout/DeliveryForm";
import OrderReview from "../components/checkout/OrderReview";
import CheckoutSuccess from "../components/checkout/CheckoutSuccess";
import EmptyState from "../components/common/EmptyState";
import "../styles/checkout/checkoutPage.css";
import { useOrderData } from "@/service/orders/orders.providers";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  const [placedOrder, setPlacedOrder] = useState<OrderPlacedData | null>(null);

  // order provider
  const orderProvider = useOrderData();

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

    const payload: OrderPayload = {
      userId: "6a72e76134a85d2ce710053e",
      items: items.map((item) => ({
        menuItemId: item._id,
        quantity: item.quantity,
      })),
      delivery: deliveryInfo,
    };

    orderProvider.createOrder(
      { ...payload },
      {
        onSuccess: (response: OrderPlaceResponse) => {
          console.log("Order response:", response);
          setPlacedOrder(response.data);
        },
      },
    );

    clearCart();
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
