import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
  return jwt.verify(token, "sokolows", { complete: true }).payload;
};

export const getToken = (key) => {
  if (typeof window !== "undefined") {
    // return localStorage.getItem(key);
    return new Promise((resolve, reject) => {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) {
          resolve(value);
        }
      } catch (e) {
        reject.apply(e);
      }
    });
  }
};
