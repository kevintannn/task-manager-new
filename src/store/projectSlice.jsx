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

    modifyProject(state, action) {
      state.projects = state.projects.map((item) => {
        if (item.id == action.payload.id) {
          return { ...item, ...action.payload.properties };
        }

        return item;
      });
    },

    deleteProject(state, action) {
      state.projects = state.projects.filter(
        (item) => item.id != action.payload,
      );
    },
  },
});

export const projectActions = projectSlice.actions;

export default projectSlice;
