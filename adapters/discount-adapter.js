import http from "./xhr";

const putDidcount = (discountObj) => {
  return http.post(`/api/product/put-discount`, discountObj);
};

const getDiscounts = () => {
  return http.get(`/api/product/discounts`);
};

const getDiscount = (title) => {
  return http.get(`/api/product/discounts/${title}`);
};

const getProductsWithoutDiscount = () => {
  return http.get(`/api/product/without-discount`);
};

const expireDiscount = (id) => {
  return http.put(`/api/product/expire-discount`, { id });
};

const removeProduct = (discountId, product) => {
  console.log(discountId, product);
  return http.put(`/api/product/remove-product-discount`, {
    discountId,
    product,
  });
};
// eslint-disable-next-line
export default {
  putDidcount,
  getDiscounts,
  getDiscount,
  getProductsWithoutDiscount,
  expireDiscount,
  removeProduct,
};
