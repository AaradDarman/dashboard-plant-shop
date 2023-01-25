import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import api from "adapters/user-adapter";
import { decodeToken } from "utils/token-helper";

export const login = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.login({ username, password });
      if (status === 200) {
        return decodeToken(data.token).user;
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

export const signup = createAsyncThunk(
  "user/signup",
  async (
    { fName, lName, email, phoneNumber, personalCode, password },
    { rejectWithValue }
  ) => {
    try {
      const { status, data } = await api.signup({
        fName,
        lName,
        email,
        phoneNumber,
        personalCode,
        password,
      });
      if (status === 201) {
        toast.success(data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data;
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

export const userCheck = createAsyncThunk(
  "user/user-check",
  async ({ username }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.sendCode({ username });
      if (status === 200) {
        toast.success(data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data;
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

export const verify = createAsyncThunk(
  "user/verify",
  async ({ otp }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.confirmCode({ otp });
      if (status === 200) {
        return data;
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

export const resetPassword = createAsyncThunk(
  "user/reset-pass",
  async ({ newPassword, tk }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.resetPassword({
        newPassword,
        token: tk,
      });
      if (status === 200) {
        toast.success(data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return decodeToken(data.token).user;
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

export const signupVerify = createAsyncThunk(
  "user/signup-verify",
  async (verificationCode, { rejectWithValue }) => {
    try {
      const { status, data } = await api.verify({ verificationCode });
      if (status === 200) {
        toast.success("اکانت شما با موفقیت فعال شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
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

export const resendVerificationCode = createAsyncThunk(
  "user/signup-verify",
  async (userId, { rejectWithValue }) => {
    try {
      const { status, data } = await api.resend({ userId });
      if (status === 200) {
        toast.success(data.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data;
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

export const changePhoneNumber = createAsyncThunk(
  "user/change-phoneNumber",
  async (newPhoneNumber, { rejectWithValue }) => {
    try {
      const { status, data } = await api.changePhoneNumber(newPhoneNumber);
      if (status === 200) {
        toast.success(data.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.user;
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

export const addNewAddress = createAsyncThunk(
  "user/add-new-address",
  async (
    {
      userId,
      city,
      province,
      postalCode,
      plaque,
      postalAddress,
      receiver,
      geoLocation,
    },
    { rejectWithValue }
  ) => {
    try {
      const { status, data } = await api.addNewAddress({
        userId,
        city,
        province,
        postalCode,
        plaque,
        postalAddress,
        receiver,
        geoLocation,
      });
      if (status === 201) {
        toast.success(data.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.newAddress;
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

export const editAddress = createAsyncThunk(
  "user/edit-address",
  async (
    {
      addressId,
      userId,
      city,
      province,
      postalCode,
      plaque,
      postalAddress,
      receiver,
      geoLocation,
    },
    { rejectWithValue }
  ) => {
    try {
      const { status, data } = await api.addNewAddress({
        addressId,
        userId,
        city,
        province,
        postalCode,
        plaque,
        postalAddress,
        receiver,
        geoLocation,
      });
      if (status === 200) {
        toast.success(data.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.newAddress;
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

export const deleteAddress = createAsyncThunk(
  "user/delete-address",
  async (addressId, { rejectWithValue }) => {
    try {
      const { status, data } = await api.deleteAddress(addressId);
      if (status === 200) {
        toast.success(data.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
        return addressId;
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

const userSlice = createSlice({
  name: "user",
  initialState: { status: "idle", user: {} },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state, action) => {
      state.user = {};
    },
    // logout: (state, action) => {
    //   return {};
    // },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = "idle";
    },
    [login.pending]: (state, action) => {
      state.status = "loading";
    },
    [login.rejected]: (state, action) => {
      state.status = "idle";
    },
    [signup.fulfilled]: (state, action) => {
      state.status = "idle";
    },
    [signup.pending]: (state, action) => {
      state.status = "loading";
    },
    [signup.rejected]: (state, action) => {
      state.status = "idle";
    },
    [signupVerify.fulfilled]: (state, action) => {
      state.status = "idle";
    },
    [signupVerify.pending]: (state, action) => {
      state.status = "loading";
    },
    [signupVerify.rejected]: (state, action) => {
      state.status = "idle";
    },
    [userCheck.fulfilled]: (state, action) => {
      state.status = "idle";
    },
    [userCheck.pending]: (state, action) => {
      state.status = "loading";
    },
    [userCheck.rejected]: (state, action) => {
      state.status = "idle";
    },
    [verify.fulfilled]: (state, action) => {
      state.status = "idle";
    },
    [verify.pending]: (state, action) => {
      state.status = "loading";
    },
    [verify.rejected]: (state, action) => {
      state.status = "idle";
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = "idle";
    },
    [resetPassword.pending]: (state, action) => {
      state.status = "loading";
    },
    [resetPassword.rejected]: (state, action) => {
      state.status = "idle";
    },
    [resendVerificationCode.fulfilled]: (state, action) => {
      state.status = "idle";
    },
    [resendVerificationCode.pending]: (state, action) => {
      state.status = "loading";
    },
    [resendVerificationCode.rejected]: (state, action) => {
      state.status = "idle";
    },
    [changePhoneNumber.fulfilled]: (state, action) => {
      state.status = "idle";
      state.user = action.payload;
    },
    [changePhoneNumber.pending]: (state, action) => {
      state.status = "loading";
    },
    [changePhoneNumber.rejected]: (state, action) => {
      state.status = "idle";
    },
    [addNewAddress.fulfilled]: (state, action) => {
      state.status = "idle";
      state.user.addresses.push(action.payload);
    },
    [addNewAddress.pending]: (state, action) => {
      state.status = "loading";
    },
    [addNewAddress.rejected]: (state, action) => {
      state.status = "idle";
    },
    [editAddress.fulfilled]: (state, action) => {
      let addressIndex = state.user.addresses.findIndex(
        (address) => address._id === action.payload._id
      );
      state.user.addresses[addressIndex] = action.payload;
      state.status = "idle";
    },
    [editAddress.pending]: (state, action) => {
      state.status = "loading";
    },
    [editAddress.rejected]: (state, action) => {
      state.status = "idle";
    },
    [deleteAddress.fulfilled]: (state, action) => {
      state.status = "idle";
      state.user.addresses = state.user.addresses.filter(
        (address) => address._id != action.payload
      );
    },
    [deleteAddress.pending]: (state, action) => {
      state.status = "loading";
    },
    [deleteAddress.rejected]: (state, action) => {
      state.status = "idle";
    },
  },
});
export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
