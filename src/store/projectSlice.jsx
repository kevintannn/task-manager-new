import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
  },
  reducers: {
    replaceProjects(state, action) {
      state.projects = action.payload;
    },

    addProject(state, action) {
      state.projects.push(action.payload);
    },
  },
});

export const projectActions = projectSlice.actions;

export default projectSlice;
