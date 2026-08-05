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

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

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

export interface OrderReal {
  _id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  delivery: Delivery;
  createdAt: string;
  updatedAt: string;
  __v: number;
  items: OrderItem[];
}

interface OrderItem {
  _id: string;
  orderId: string;
  menuItemId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface Delivery {
  name: string;
  phone: string;
  address: string;
}

export interface OrderPayload {
  userId: string;
  delivery: Delivery;
  items: orderItem[];
}

interface orderItem {
  menuItemId: string;
  quantity: number;
}

interface Delivery {
  name: string;
  phone: string;
  address: string;
}

export interface MenuListParams {
  page?: number;
  limit?: number;
  search?: string;
  category: string;
}

export interface MenuResponse<T = unknown> {
  data: T;
}

export interface MenuItem2 {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends MenuItem2 {
  quantity: number;
}

export interface MenuApiResponse {
  message: string;
  data: {
    data: MenuItem2[];
    hasNext: boolean;
    page: string;
    total: number;
  };
}
