import { projectActions } from "./projectSlice";
import { uiActions } from "./uiSlice";
import { getDatasFromAxios } from "../utils";
import axios from "axios";
import { firebaseRealtimeDatabaseURL } from "../constants";

export const getProjects = () => {
  return async (dispatch) => {
    // const projectsJSON = localStorage.getItem("projects");
    // const projects = projectsJSON ? JSON.parse(projectsJSON) : [];

    // dispatch(projectActions.replaceProjects(projects));

    // firebase
    const getProjectsFromDatabase = async () => {
      const data = await getDatasFromAxios("projects");
      dispatch(projectActions.replaceProjects(data ?? []));
    };
    await getProjectsFromDatabase();
  };
};

export const deleteProject = (projectId) => {
  return async (dispatch) => {
    // local storage
    // const existingProjectsJSON = localStorage.getItem("projects");
    // const existingProjects = existingProjectsJSON
    //   ? JSON.parse(existingProjectsJSON).filter((item) => item.id != projectId)
    //   : [];

    // localStorage.setItem("projects", JSON.stringify(existingProjects));

    // dispatch(projectActions.replaceProjects(existingProjects));

    // dispatch(
    //   uiActions.setNotification({
    //     type: "success",
    //     message: "Project deleted!",
    //     open: true,
    //   }),
    // );

    // return true;

    // firebase
    let success = false;

    await axios
      .delete(`${firebaseRealtimeDatabaseURL}/tasks/${projectId}.json`)
      .then((res) => {
        if (res.status === 200) {
          dispatch(projectActions.deleteProject(projectId));

          dispatch(
            uiActions.setNotification({
              type: "success",
              message: "Project deleted!",
              open: true,
            }),
          );

          success = true;
        }
      })
      .catch((err) => console.log(err));

    return success;
  };
};
