import { taskActions } from "./taskSlice";

export const getTasks = () => {
  return (dispatch) => {
    const tasksJSON = localStorage.getItem("tasks");
    const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];

    dispatch(taskActions.replaceTasks(tasks));
  };
};
