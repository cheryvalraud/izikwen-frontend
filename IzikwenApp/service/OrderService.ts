import { api } from "./api";

export const createOrder = async (payload: any) => {
  const res = await api.post("/orders/buy", payload);
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getOrderById = async (orderId: string) => {   
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

export const getOrdersByUserId = async (userId: string) => {   
  const res = await api.get(`/orders/user/${userId}`);
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {   
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data;
};

export const cancelOrder = async (orderId: string) => {   
  const res = await api.put(`/orders/${orderId}/cancel`);
  return res.data;
};


export const deleteOrder = async (orderId: string) => {   
  const res = await api.delete(`/orders/${orderId}`);
  return res.data;
};

