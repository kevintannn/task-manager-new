import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import taskSlice from "./taskSlice";
import uiSlice from "./uiSlice";
import projectSlice from "./projectSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    task: taskSlice.reducer,
    project: projectSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export default store;
