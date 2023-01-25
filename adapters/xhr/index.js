import axios from "axios";
import { toast } from "react-toastify";
import _ from "lodash";

import { resetLocalCart } from "redux/slices/cart";
import { resetUser } from "redux/slices/user";
import store from "redux/store";

axios.interceptors.response.use(null, (error) => {
  const expectetErrors =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (
    error?.response?.status === 401 &&
    !_.isEmpty(store.getState().user.user)
  ) {
    store.dispatch(resetUser());
    store.dispatch(resetLocalCart());
  }

  if (!expectetErrors) {
    toast.error("مشکلی از سمت سرور رخ داده است.", {
      position: "top-right",
      closeOnClick: true,
    });
    console.log(error);
    console.log(error.response.data);
    return Promise.reject(error);
  }

  return Promise.reject(error);
});
// eslint-disable-next-line
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
