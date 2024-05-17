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

    changeDivisionId(state, action) {
      state.user.divisionId = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
