export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  modelCode?: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  color?: string;
  bodyWood?: string;
  neckWood?: string;
  fingerboard?: string;
  pickupConfig?: string;
  active: boolean;
  categoryId: number;
  categoryName: string;
}

export interface ProductRequest {
  name: string;
  brand: string;
  modelCode?: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  color?: string;
  bodyWood?: string;
  neckWood?: string;
  fingerboard?: string;
  pickupConfig?: string;
  active?: boolean;
  categoryId: number;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingZip: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  salesByMonth: { month: string; revenue: number; orders: number }[];
}
