/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { format } from "date-fns";
import PrimaryButton from "../components/PrimaryButton";
import { taskActions } from "../store/taskSlice";
import { uiActions } from "../store/uiSlice";
import Person from "../components/Person";
import { createActivity, getDatasFromAxios, getDuration } from "../utils";
import { useEffect, useState } from "react";
import { deleteTask } from "../store/taskActions";
import axios from "axios";
import { firebaseRealtimeDatabaseURL } from "../constants";
import Loading from "../components/Loading";

const ViewTask = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);
  const tasks = useSelector((state) => state.task.tasks);
  const task = tasks.find((item) => item.id == id);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleMarkAsDone = async () => {
    if (!confirm("Confirm mark task as done?")) {
      return;
    }

    const modifiedProperties = {
      completed: true,
      completedBy: user.id,
    };

    // firebase
    await axios
      .patch(
        `${firebaseRealtimeDatabaseURL}/tasks/${id}.json`,
        modifiedProperties,
      )
      .then(async (res) => {
        if (res.data) {
          dispatch(
            taskActions.modifyTask({ id: id, properties: modifiedProperties }),
          );
          dispatch(
            uiActions.setNotification({
              type: "success",
              message: "Task marked as completed!",
              open: true,
            }),
          );

          await createActivity(user.id, `marked "${task.title}" task as done.`);
        }
      })
      .catch((err) => console.log(err));

    // local storage
    // const existingTasksJSON = localStorage.getItem("tasks");
    // const existingTasks = existingTasksJSON
    //   ? JSON.parse(existingTasksJSON)
    //   : [];

    // existingTasks.find((item) => item.id === task.id).completed = true;
    // existingTasks.find((item) => item.id === task.id).completedBy = user.id;

    // localStorage.setItem("tasks", JSON.stringify(existingTasks));
    // dispatch(taskActions.replaceTasks(existingTasks));
    // dispatch(
    //   uiActions.setNotification({
    //     type: "success",
    //     message: "Task marked as completed!",
    //     open: true,
    //   }),
    // );
  };

  const handleDeleteTask = async () => {
    if (!confirm("Confirm delete task? (can not be undone)")) {
      return;
    }

    setLoading(true);

    if (await dispatch(deleteTask(id))) {
      await createActivity(user.id, `deleted "${task.title}" task.`);
      return navigate("/");
    }
  };

  useEffect(() => {
    if (!task && !loading) {
      dispatch(
        uiActions.setNotification({
          type: "error",
          message: "Task not found!",
          open: true,
        }),
      );

      return navigate("/");
    }

    if (!loading) {
      const startDateTime = new Date(task.startDateTime);
      const endDateTime = new Date(task.endDateTime);

      setDuration(getDuration(startDateTime, endDateTime));
    }
  }, [navigate, task, dispatch, loading]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      setDivisions(await getDatasFromAxios("divisions"));
      setUsers(await getDatasFromAxios("users"));
    };
    fetchData().finally(() => setLoading(false));
  }, [dispatch]);

  return loading ? (
    <Loading />
  ) : (
    task && (
      <div className="my-20 flex justify-center gap-20">
        {/* left section */}
        <div className="w-[600px]">
          {/* upper */}
          <div className="mb-7 flex flex-col gap-1">
            {/* title and edit button */}
            <div className="flex items-center justify-between gap-3">
              {/* title */}
              <h1 className="text-3xl font-bold">{task.title}</h1>

              <div className="flex items-center gap-1">
                {/* edit button */}
                <PrimaryButton
                  cname={"py-2 w-fit self-end"}
                  href={`/tasks/${task.id}/edit`}
                >
                  Edit
                </PrimaryButton>

                {/* delete button */}
                <PrimaryButton
                  cname={"py-2 w-fit self-end bg-red-700 hover:bg-red-600"}
                  handleClick={handleDeleteTask}
                >
                  Delete
                </PrimaryButton>
              </div>
            </div>

            {/* duration and priority */}
            <div className="flex flex-col text-sm">
              {task?.updatedBy && (
                <p className="text-xs text-gray-600">
                  Last edited by{" "}
                  {users?.find((item) => item.id == task.updatedBy)?.name} at{" "}
                  {format(task.updatedAt, "d MMM y (hh:mm:ss aa)")}
                </p>
              )}

              <p className="mt-3">{duration}</p>

              <p>Priority: {task.priority}</p>
            </div>
          </div>

          {/* lower */}
          <div className="rounded-lg bg-blue-100">
            <p className="p-5 text-justify leading-6 tracking-wide">
              {task.description}
            </p>
          </div>
        </div>

        {/* right section */}
        <div className="flex flex-col gap-5">
          <p className="text-sm font-bold">
            Division:{" "}
            {divisions?.find((item) => item.id == task.division)?.name}
          </p>

          <Box
            component={Paper}
            elevation={3}
            className="flex w-[300px] flex-col gap-3 p-5"
            sx={{
              borderRadius: "10px",
            }}
          >
            {task.people.map((item, idx) => (
              <Person key={idx} id={item} idx={idx} type={"creator_label"} />
            ))}
          </Box>

          <PrimaryButton
            cname={
              task.completed
                ? "justify-center bg-green-700 hover:bg-green-700 cursor-default"
                : "justify-center"
            }
            handleClick={task.completed ? () => {} : handleMarkAsDone}
          >
            {task.completed ? "Task Completed" : "Mark as done"}
          </PrimaryButton>
        </div>
      </div>
    )
  );
};

export default ViewTask;
