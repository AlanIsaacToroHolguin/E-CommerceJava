import { api } from './client';
import {
  AuthResponse,
  Category,
  DashboardStats,
  Order,
  OrderStatus,
  PageResponse,
  Product,
  ProductRequest,
  User
} from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => api.post<AuthResponse>('/auth/register', payload).then((r) => r.data)
};

export const productsApi = {
  search: (params: {
    name?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }) =>
    api.get<PageResponse<Product>>('/products', { params }).then((r) => r.data),
  byId: (id: number) => api.get<Product>(`/products/${id}`).then((r) => r.data),
  create: (payload: ProductRequest) =>
    api.post<Product>('/products', payload).then((r) => r.data),
  update: (id: number, payload: ProductRequest) =>
    api.put<Product>(`/products/${id}`, payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/products/${id}`).then(() => undefined)
};

export const categoriesApi = {
  all: () => api.get<Category[]>('/categories').then((r) => r.data),
  create: (payload: Omit<Category, 'id'>) =>
    api.post<Category>('/categories', payload).then((r) => r.data),
  update: (id: number, payload: Omit<Category, 'id'>) =>
    api.put<Category>(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/categories/${id}`).then(() => undefined)
};

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}
export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export const cartApi = {
  get: () => api.get<Cart>('/cart').then((r) => r.data),
  addItem: (productId: number, quantity: number) =>
    api.post<Cart>('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (itemId: number, quantity: number) =>
    api.patch<Cart>(`/cart/items/${itemId}`, null, { params: { quantity } }).then((r) => r.data),
  remove: (itemId: number) => api.delete<Cart>(`/cart/items/${itemId}`).then((r) => r.data),
  clear: () => api.delete('/cart').then(() => undefined)
};

export const ordersApi = {
  all: (page = 0, size = 10) =>
    api.get<PageResponse<Order>>('/orders', { params: { page, size } }).then((r) => r.data),
  mine: (page = 0, size = 10) =>
    api.get<PageResponse<Order>>('/orders/me', { params: { page, size } }).then((r) => r.data),
  create: (payload: {
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    shippingZip: string;
  }) => api.post<Order>('/orders', payload).then((r) => r.data),
  updateStatus: (id: number, status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data)
};

export const usersApi = {
  all: (page = 0, size = 20) =>
    api.get<PageResponse<User>>('/users', { params: { page, size } }).then((r) => r.data),
  me: () => api.get<User>('/users/me').then((r) => r.data)
};

export const statsApi = {
  dashboard: () => api.get<DashboardStats>('/admin/stats/dashboard').then((r) => r.data)
};
