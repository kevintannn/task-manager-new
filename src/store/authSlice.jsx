import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: null,
    username: null,
  },
  reducers: {
    login(state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
