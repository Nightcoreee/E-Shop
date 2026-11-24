import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";

export const register = createAsyncThunk(
  "auth/register", 
  async (data, thunkAPI ) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success(res.data.message);
      thunkAPI.dispatch(toggleAuthPopup());
    } catch(error) {
      toast.error(error.response.data.message);
    }
});

export const login = createAsyncThunk(
  "auth/login", 
  async (data, thunkAPI) => {
});

export const getUser = createAsyncThunk(
  "auth/getUser", 
  async (_, thunkAPI) => {
});

export const logout = createAsyncThunk(
  "auth/logout", 
  async (_, thunkAPI) => {
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {},
});

export default authSlice.reducer;