import { projectActions } from "./projectSlice";
import { uiActions } from "./uiSlice";

export const getProjects = () => {
  return (dispatch) => {
    const projectsJSON = localStorage.getItem("projects");
    const projects = projectsJSON ? JSON.parse(projectsJSON) : [];

    dispatch(projectActions.replaceProjects(projects));
  };
};

export const deleteProject = (projectId) => {
  return (dispatch) => {
    const existingProjectsJSON = localStorage.getItem("projects");
    const existingProjects = existingProjectsJSON
      ? JSON.parse(existingProjectsJSON).filter((item) => item.id != projectId)
      : [];

    localStorage.setItem("projects", JSON.stringify(existingProjects));

    dispatch(projectActions.replaceProjects(existingProjects));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Project deleted!",
        open: true,
      }),
    );

    return true;
  };
};
