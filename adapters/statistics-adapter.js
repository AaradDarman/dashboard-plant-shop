import http from "./xhr";

const getTopProducts = (query) => {
  return http.get(`/api/statistics/top-products`, {
    params: query,
  });
};

const getRecentTransactions = (query) => {
  return http.get(`/api/statistics/recent-transactions`, {
    params: query,
  });
};

const getProductViews = (query) => {
  return http.get(`/api/statistics/product-views`, {
    params: query,
  });
};

const getLoyalCustomers = (query) => {
  return http.get(`/api/statistics/loyal-customers`, {
    params: query,
  });
};

// eslint-disable-next-line
export default {
  getTopProducts,
  getRecentTransactions,
  getProductViews,
  getLoyalCustomers,
};
