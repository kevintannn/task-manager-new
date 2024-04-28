import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
  },
  reducers: {
    replaceTasks(state, action) {
      state.tasks = action.payload;
    },

    addTask(state, action) {
      state.tasks.push(action.payload);
    },
  },
});

export const taskActions = taskSlice.actions;

export default taskSlice;
