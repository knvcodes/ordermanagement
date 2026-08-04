export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // stored in cents
  category: string;
  image: string;
  rating: number;
  prepTime: number; // minutes
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus =
  | "received"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export interface DeliveryInfo {
  name: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number; // cents
}
