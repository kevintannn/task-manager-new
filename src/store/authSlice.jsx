import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },

    logout(state) {
      state.user = {};
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
