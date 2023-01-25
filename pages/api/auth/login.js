/* eslint-disable import/no-anonymous-default-export */
import { proxy } from "server/proxy";

import Cookies from "cookies";
import { decodeToken } from "utils/token-helper";

const LOGIN_ENDPOINT_PATH = "/user/login";

export default (req, res) => {
  return new Promise((resolve, reject) => {
    // we're changing the url to our login endpoint without the /api prefix
    req.url = LOGIN_ENDPOINT_PATH;

    /**
     * if an error occurs in the proxy, we will reject the promise.
     * it is so important. if you don't reject the promise,
     *  you're facing the stalled requests issue.
     */
    proxy.once("error", reject);

    proxy.once("proxyRes", (proxyRes, req, res) => {
      let body = [];

      proxyRes.on("data", (chunk) => body.push(chunk));

      // don't forget the catch the errors
      proxyRes.once("error", reject);

      proxyRes.on("end", () => {
        const isSuccess = proxyRes.statusCode === 200;

        body = JSON.parse(Buffer.concat(body).toString());

        if (isSuccess) {
          let decodedToken = decodeToken(body.token);
          const cookies = new Cookies(req, res);
          if (decodedToken.user.isAdmin) {
            cookies.set("authorization", body.token, {
              httpOnly: true,
              sameSite: "lax",
              expires: new Date(decodedToken.exp * 1000),
            });
            res.status(200).json(body);
          } else {
            res.status(403).json({ message: "دسترسی ندارید" });
          }
        } else {
          res.status(proxyRes.statusCode).json(body);
        }

        /**
         * we are resolving the promise here for next.js to notify we've handled it.
         */
        resolve();
      });
    });

    proxy.web(req, res, {
      /**
       * it should be enable to handle proxy response via proxyRes event.
       */
      selfHandleResponse: true,
    });
  });
};

/**
 * In next.js's api routes, bodyParser is automatically enabled.
 * Since we are using the proxy, we need to disable it.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
