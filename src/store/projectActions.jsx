import { projectActions } from "./projectSlice";

export const getProjects = () => {
  return (dispatch) => {
    const projectsJSON = localStorage.getItem("projects");
    const projects = projectsJSON ? JSON.parse(projectsJSON) : [];

    dispatch(projectActions.replaceProjects(projects));
  };
};
