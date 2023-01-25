import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../adapters/adapter";

import { toast } from "react-toastify";

export const getInitialInfo = createAsyncThunk(
  "products/initialIntel",
  async () => {
    try {
      const { status, data } = await api.getInitialIntel();
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const getProducts = createAsyncThunk(
  "products/get",
  async ({ page, sortBy }) => {
    console.log(page);
    console.log(sortBy);
    try {
      const { status, data } = await api.getProducts({ page, sortBy });
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const addNewProduct = createAsyncThunk(
  "products/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { status, data } = await api.createProduct(formData);
      if (status === 201) {
        toast.success("محصول با موفقیت ذخیره شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.product;
      }
    } catch (e) {
      if (!e.response) {
        throw e;
      }
      if (e.response.status != 500) {
        toast.error(e?.response?.data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
      }
      return rejectWithValue(e?.response?.data);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async (editedProduct) => {
    try {
      const { status, data } = await api.editProduct(editedProduct);
      if (status === 200) {
        toast.success("محصول با موفقیت ویرایش شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.product;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    try {
      const { status, data } = await api.deleteProduct(id);
      if (status === 200) {
        toast.success("محصول با موفقیت حذف شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.product._id;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const addNewCategory = createAsyncThunk(
  "products/addNewCategory",
  async (category) => {
    try {
      const { status, data } = await api.addNewCategory(category);
      if (status === 201) {
        toast.success("دسته بندی با موفقیت اضافه شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.newCategory;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const addNewSize = createAsyncThunk(
  "products/addNewSize",
  async (size) => {
    try {
      const { status, data } = await api.addNewSize(size);
      console.log(data);
      if (status === 201) {
        toast.success("سایز با موفقیت اضافه شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.newSize;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

// Slice
const slice = createSlice({
  name: "products",
  initialState: {
    status: "idle",
    entity: [],
    count: 0,
    cheapest: 0,
    mostExpensive: 0,
    categories: [],
    sizes: [],
  },
  reducers: {},
  extraReducers: {
    [getProducts.fulfilled]: (state, action) => {
      state.entity = action.payload.products;
      state.count = action.payload.productsCount;
      state.status = "idle";
    },
    [getProducts.pending]: (state) => {
      state.status = "loading";
    },
    [addNewProduct.fulfilled]: (state, action) => {
      state.entity.unshift(action.payload);
      state.status = "idle";
    },
    [addNewProduct.pending]: (state) => {
      state.status = "creating";
    },
    [addNewProduct.rejected]: (state, action) => {
      state.status = "idle";
    },
    [editProduct.fulfilled]: (state, action) => {
      let productIndex = state?.entity?.findIndex(
        (p) => p?._id === action.payload?._id
      );
      state.entity[productIndex] = action.payload;
      state.status = "idle";
    },
    [editProduct.pending]: (state) => {
      state.status = "editing";
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.entity = state.entity.filter((p) => p._id !== action.payload);
      state.status = "idle";
    },
    [deleteProduct.pending]: (state) => {
      state.status = "deleting";
    },
    [addNewCategory.fulfilled]: (state, action) => {
      state.categories.push(action.payload);
      state.status = "idle";
    },
    [addNewCategory.pending]: (state) => {
      state.status = "creating";
    },
    [addNewSize.fulfilled]: (state, action) => {
      state.sizes.push(action.payload);
      state.status = "idle";
    },
    [addNewSize.pending]: (state) => {
      state.status = "creating";
    },
    [getInitialInfo.fulfilled]: (state, action) => {
      state.cheapest = action.payload?.cheapest;
      state.mostExpensive = action.payload?.mostExpensive;
      state.categories = action.payload?.categories;
      state.sizes = action.payload?.sizes;
      state.status = "idle";
    },
    [getInitialInfo.pending]: (state) => {
      state.status = "loading";
    },
  },
});
export default slice.reducer;
