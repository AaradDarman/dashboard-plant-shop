/* eslint-disable import/no-anonymous-default-export */
import { proxy } from "server/proxy";

import Cookies from "cookies";

export default (req, res) => {
  return new Promise((resolve, reject) => {
    req.url = req.url.replace(/^\/api/, "");

    const cookies = new Cookies(req, res);
    const authorization = cookies.get("authorization");
    req.headers.cookie = "";

    if (authorization) {
      req.headers.authorization = authorization;
    }

    proxy.once("error", reject);

    proxy.web(req, res);
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
