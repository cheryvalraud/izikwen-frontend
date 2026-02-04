import { api } from  "../service/api";

export const adminGetPendingOrders = async () => {
  const res = await api.get("/admin/orders", {
    params: { status: "PENDING" },
  });
  return res.data;
};

export const adminUpdateOrderStatus = async (
  orderId: number,
  status: "COMPLETED" | "FAILED"
) => {
  const res = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return res.data;
};
