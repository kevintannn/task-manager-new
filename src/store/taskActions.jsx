import { taskActions } from "./taskSlice";
import { uiActions } from "./uiSlice";

export const getTasks = () => {
  return (dispatch) => {
    const tasksJSON = localStorage.getItem("tasks");
    const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];

    dispatch(taskActions.replaceTasks(tasks));
  };
};

export const deleteTask = (taskId) => {
  return (dispatch) => {
    const existingTasksJSON = localStorage.getItem("tasks");
    const existingTasks = existingTasksJSON
      ? JSON.parse(existingTasksJSON).filter((item) => item.id != taskId)
      : [];

    localStorage.setItem("tasks", JSON.stringify(existingTasks));

    dispatch(taskActions.replaceTasks(existingTasks));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Task deleted!",
        open: true,
      }),
    );

    return true;
  };
};
