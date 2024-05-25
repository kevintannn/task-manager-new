import { taskActions } from "./taskSlice";
import { uiActions } from "./uiSlice";
import { getDatasFromAxios } from "../utils";
import axios from "axios";
import { firebaseRealtimeDatabaseURL } from "../constants";

export const getTasks = () => {
  return async (dispatch) => {
    const getTasksFromDatabase = async () => {
      const data = await getDatasFromAxios("tasks");
      dispatch(taskActions.replaceTasks(data ?? []));
    };
    await getTasksFromDatabase();

    // const tasksJSON = localStorage.getItem("tasks");
    // const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];

    // dispatch(taskActions.replaceTasks(tasks));
  };
};

export const deleteTask = (taskId) => {
  return async (dispatch) => {
    // local storage
    // const existingTasksJSON = localStorage.getItem("tasks");
    // const existingTasks = existingTasksJSON
    //   ? JSON.parse(existingTasksJSON).filter((item) => item.id != taskId)
    //   : [];

    // localStorage.setItem("tasks", JSON.stringify(existingTasks));

    // dispatch(taskActions.replaceTasks(existingTasks));

    // firebase
    let success = false;

    await axios
      .delete(`${firebaseRealtimeDatabaseURL}/tasks/${taskId}.json`)
      .then((res) => {
        if (res.status === 200) {
          dispatch(taskActions.deleteTask(taskId));

          dispatch(
            uiActions.setNotification({
              type: "success",
              message: "Task deleted!",
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
