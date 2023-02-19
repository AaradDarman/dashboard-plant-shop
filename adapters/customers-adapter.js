import http from "./xhr";

const getCustomers = (query) => {
  return http.get(`/api/customers`, {
    params: query,
  });
};

const getOrders = (id) => {
  return http.get(`/api/customers/orders`, { params: { id } });
};

// eslint-disable-next-line
export default {
  getCustomers,
  getOrders,
};
