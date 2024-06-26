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

    modifyTask(state, action) {
      state.tasks = state.tasks.map((item) => {
        if (item.id == action.payload.id) {
          return { ...item, ...action.payload.properties };
        }

        return item;
      });
    },

    deleteTask(state, action) {
      state.tasks = state.tasks.filter((item) => item.id != action.payload);
    },
  },
});

export const taskActions = taskSlice.actions;

export default taskSlice;
