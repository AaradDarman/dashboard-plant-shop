import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { cleanStorage } from "utils/browser-storage";
import api from "adapters/adapter";
import basketApi from "adapters/basket-adapter";

export const getUserCartItems = createAsyncThunk(
  "cart/getItems",
  async (userId) => {
    try {
      const { status, data } = await api.getBasket(userId);
      if (status === 200) {
        return data.basket;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const syncCartToDb = createAsyncThunk(
  "cart/cyncItemsToDb",
  async (items) => {
    try {
      const { status, data } = await basketApi.syncBasket({ items });
      if (status === 200) {
        cleanStorage();
        return data.basketItems;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const addItemToDbCart = createAsyncThunk(
  "cart/addItemsTodb",
  async ({ item, userId }, { rejectWithValue }) => {
    try {
      const { status, data } = await basketApi.addToBasket({ item, userId });
      if (status === 200) {
        return data.basket;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
      return rejectWithValue(e?.response?.data);
    }
  }
);

export const removeItemFromDbCart = createAsyncThunk(
  "cart/removeItemsFromdb",
  async ({ item, userId }) => {
    try {
      const { status, data } = await basketApi.removeFromBasket({
        item,
        userId,
      });
      if (status === 200) {
        return data.basket;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

const initialState = {
  status: "idle",
  itemsCount: 0,
  items: [],
  totalPrice: 0,
  totalPriceWithDiscount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToLocalCart: (state, action) => {
      if (state.itemsCount === 0) {
        state.items.push({ ...action.payload, quantity: 1 });
        state.itemsCount++;
        state.totalPrice = state.items.reduce(
          (total, item) => item.price * item.quantity + total,
          0
        );
        state.totalPriceWithDiscount = state.items.reduce((total, item) => {
          if (item.discount) {
            return (
              (item.price - (item.price * item.discount) / 100) *
                item.quantity +
              total
            );
          } else {
            return item.price * item.quantity + total;
          }
        }, 0);
      } else {
        let isExist = false;
        state.items.map((item) => {
          if (
            item._id === action.payload._id &&
            item?.size == action.payload.size
          ) {
            item.quantity += 1;
            state.itemsCount++;
            isExist = true;
            state.totalPrice = state.items.reduce(
              (total, item) => item.price * item.quantity + total,
              0
            );
            state.totalPriceWithDiscount = state.items.reduce((total, item) => {
              if (item.discount) {
                return (
                  (item.price -
                    Math.round((item.price * item.discount) / 100)) *
                    item.quantity +
                  total
                );
              } else {
                return item.price * item.quantity + total;
              }
            }, 0);
            return item;
          }
        });
        if (!isExist) {
          state.items.push({ ...action.payload, quantity: 1 });
          state.itemsCount++;
          state.totalPrice = state.items.reduce(
            (total, item) => item.price * item.quantity + total,
            0
          );
          state.totalPriceWithDiscount = state.items.reduce((total, item) => {
            if (item.discount) {
              return (
                (item.price - Math.round((item.price * item.discount) / 100)) *
                  item.quantity +
                total
              );
            } else {
              return item.price * item.quantity + total;
            }
          }, 0);
        }
      }
    },
    removeItemFromLocalCart(state, action) {
      let itemIndex = state.items.findIndex(
        (item) =>
          item._id === action.payload._id && item.size === action.payload.size
      );
      if (state.items[itemIndex].quantity > 1) {
        state.items[itemIndex].quantity -= 1;
        state.itemsCount--;
        state.totalPrice = state.items.reduce(
          (total, item) => item.price * item.quantity + total,
          0
        );
        state.totalPriceWithDiscount = state.items.reduce((total, item) => {
          if (item.discount) {
            return (
              (item.price - Math.round((item.price * item.discount) / 100)) *
                item.quantity +
              total
            );
          } else {
            return item.price * item.quantity + total;
          }
        }, 0);
      } else {
        state.items = state.items.filter(
          (item) => item != state.items[itemIndex]
        );
        state.itemsCount--;
        state.totalPrice = state.items.reduce(
          (total, item) => item.price * item.quantity + total,
          0
        );
        state.totalPriceWithDiscount = state.items.reduce((total, item) => {
          if (item.discount) {
            return (
              (item.price - Math.round((item.price * item.discount) / 100)) *
                item.quantity +
              total
            );
          } else {
            return item.price * item.quantity + total;
          }
        }, 0);
      }
    },
    setLocalCartItems(state, action) {
      state.items = action.payload;
      state.itemsCount = action.payload
        .map((item) => item.quantity)
        .reduce((a, b) => a + b, 0);
      // state.itemsCount = action.payload.length;
      state.totalPrice = state.items.reduce(
        (total, item) => item.price * item.quantity + total,
        0
      );
      state.totalPriceWithDiscount = state.items.reduce((total, item) => {
        if (item.discount) {
          return (
            (item.price - Math.round((item.price * item.discount) / 100)) *
              item.quantity +
            total
          );
        } else {
          return item.price * item.quantity + total;
        }
      }, 0);
    },
    resetLocalCart: () => initialState,
  },
  extraReducers: {
    [getUserCartItems.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.itemsCount = action.payload.length;
      state.totalPrice = state.items.reduce(
        (total, item) => item.price * item.quantity + total,
        0
      );
      state.status = "idle";
    },
    [getUserCartItems.pending]: (state, action) => {
      state.status = "loading";
    },
    [syncCartToDb.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.itemsCount = action.payload
        .map((item) => item.quantity)
        .reduce((a, b) => a + b, 0);
      state.totalPrice = state.items.reduce(
        (total, item) => item.price * item.quantity + total,
        0
      );
      state.totalPriceWithDiscount = state.items.reduce((total, item) => {
        if (item.discount) {
          return (
            (item.price - (item.price * item.discount) / 100) * item.quantity +
            total
          );
        } else {
          return item.price * item.quantity + total;
        }
      }, 0);
      state.status = "idle";
    },
    [syncCartToDb.pending]: (state, action) => {
      state.status = "loading";
    },
    [addItemToDbCart.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.itemsCount = action.payload
        .map((item) => item.quantity)
        .reduce((a, b) => a + b, 0);
      state.totalPrice = state.items.reduce(
        (total, item) => item.price * item.quantity + total,
        0
      );
      state.totalPriceWithDiscount = state.items.reduce((total, item) => {
        if (item.discount) {
          return (
            (item.price - (item.price * item.discount) / 100) * item.quantity +
            total
          );
        } else {
          return item.price * item.quantity + total;
        }
      }, 0);
      state.status = "idle";
    },
    [addItemToDbCart.pending]: (state, action) => {
      state.status = "loading";
    },
    [addItemToDbCart.rejected]: (state, action) => {
      state.status = "idle";
    },
    [removeItemFromDbCart.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.itemsCount = action.payload
        .map((item) => item.quantity)
        .reduce((a, b) => a + b, 0);
      state.totalPrice = state.items.reduce(
        (total, item) => item.price * item.quantity + total,
        0
      );
      state.totalPriceWithDiscount = state.items.reduce((total, item) => {
        if (item.discount) {
          return (
            (item.price - (item.price * item.discount) / 100) * item.quantity +
            total
          );
        } else {
          return item.price * item.quantity + total;
        }
      }, 0);
      state.status = "idle";
    },
    [removeItemFromDbCart.pending]: (state, action) => {
      state.status = "loading";
    },
  },
});
export const {
  addItemToLocalCart,
  removeItemFromLocalCart,
  setLocalCartItems,
  resetLocalCart,
} = cartSlice.actions;
export default cartSlice.reducer;
