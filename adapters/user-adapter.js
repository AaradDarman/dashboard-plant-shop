import http from "./xhr";

const login = (user) => {
  return http.post(`/api/auth/login`, user);
};

const signup = (user) => {
  return http.post(`/api/user/signup`, user);
};

const addNewAddress = (addressInfo) => {
  return http.post(`/api/user/add-address`, addressInfo);
};

const deleteAddress = (addressId) => {
  return http.delete(`/api/user/delete-address/${addressId}`);
};

const sendCode = (username) => {
  return http.post(`/api/user/update/phone-number/send-code`, username);
};

const confirmCode = (otp) => {
  return http.post(`/api/user/update/phone-number/confirm-code`, otp);
};

const resetPassword = ({ newPassword, token }) => {
  return http.post(`/api/auth/reset-pass`, { newPassword, token });
};

const verify = (verificationCode) => {
  return http.post(`/api/user/verify`, verificationCode);
};

const resend = (userId) => {
  return http.post(`/api/user/resend-verification-code`, userId);
};

const changePhoneNumber = (phoneNumber) => {
  return http.post(`/api/user/edit-phone-number`, phoneNumber);
};

const getUserData = () => {
  return http.get(`/api/user/user-data`);
};

const getUserOrders = ( activeTab = "in-progress") => {
  return http.get(`/api/order?activeTab=${activeTab}`);
};

const getUserOrdersCount = (userId) => {
  return http.get(`/api/order/get-orders-count/${userId}`);
};

// eslint-disable-next-line
export default {
  login,
  signup,
  sendCode,
  confirmCode,
  verify,
  resend,
  getUserData,
  getUserOrders,
  getUserOrdersCount,
  addNewAddress,
  deleteAddress,
  changePhoneNumber,
  resetPassword,
};
