import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    notification: {
      type: "success",
      message: "",
      open: false,
    },
    loading: true,
  },
  reducers: {
    setNotification(state, action) {
      state.notification = action.payload;
    },

    closeNotification(state) {
      state.notification.open = false;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
