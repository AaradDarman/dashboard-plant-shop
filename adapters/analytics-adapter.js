import http from "./xhr";

const getOrders = (query) => {
  return http.get(`/api/order/get`, {
    params: query,
  });
};

const cancelOrders = (orderIds) => {
  return http.put(`/api/order/cancel`, { orderIds });
};

const sendOrders = (orderId, postTrackingNumber) => {
  return http.put(`/api/order/send`, { orderId, postTrackingNumber });
};

const getProductsStock = (search, sortBy, desc, skip = 0) => {
  return http.get(`/api/products/stock`, {
    params: { search, sortBy, desc, skip },
  });
};

const getIncome = (range) => {
  return http.get(`/api/analytics/income`, {
    params: { range },
  });
};

const getFinancialStatistics = () => {
  return http.get(`/api/analytics/financial-statistics`);
};

const getOrder = (id) => {
  return http.get(`/api/order/get/${id}`);
};

// eslint-disable-next-line
export default {
  getOrders,
  getProductsStock,
  getIncome,
  getFinancialStatistics,
  getOrder,
  cancelOrders,
  sendOrders,
};
