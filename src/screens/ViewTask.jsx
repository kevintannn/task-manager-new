/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { format } from "date-fns";
import PrimaryButton from "../components/PrimaryButton";
import { taskActions } from "../store/taskSlice";
import { uiActions } from "../store/uiSlice";
import { divisions, users } from "../data";
import Person from "../components/Person";

const ViewTask = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);
  const tasks = useSelector((state) => state.task.tasks);
  const task = tasks.find((item) => item.id == id);
  const dispatch = useDispatch();

  const startDateTime = new Date(task.startDateTime);
  const endDateTime = new Date(task.endDateTime);

  const getDuration = (startDateTime, endDateTime) => {
    if (format(startDateTime, "dmy") === format(endDateTime, "dmy")) {
      const startTime = format(startDateTime, "hh:mm a");
      const endTime = format(endDateTime, "hh:mm a");
      return `${startTime} - ${endTime}`;
    }

    const formatStartDateTime = format(startDateTime, "eee, d MMM y hh:mm a");
    const formatEndDateTime = format(endDateTime, "eee, d MMM y hh:mm a");
    return `${formatStartDateTime} - ${formatEndDateTime}`;
  };

  const duration = getDuration(startDateTime, endDateTime);

  const handleMarkAsDone = () => {
    if (!confirm("Confirm mark task as done?")) {
      return;
    }

    const existingTasksJSON = localStorage.getItem("tasks");
    const existingTasks = existingTasksJSON
      ? JSON.parse(existingTasksJSON)
      : [];

    existingTasks.find((item) => item.id === task.id).completed = true;
    existingTasks.find((item) => item.id === task.id).completedBy = user.id;

    localStorage.setItem("tasks", JSON.stringify(existingTasks));
    dispatch(taskActions.replaceTasks(existingTasks));
    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Task marked as completed!",
        open: true,
      }),
    );
  };

  return (
    <div className="my-20 flex justify-center gap-20">
      {/* left section */}
      <div className="w-[600px]">
        {/* upper */}
        <div className="mb-7 flex flex-col gap-1">
          {/* title and edit button */}
          <div className="flex items-center justify-between gap-3">
            {/* title */}
            <h1 className="text-3xl font-bold">{task.title}</h1>

            {/* edit button */}
            <PrimaryButton
              cname={"py-2 w-fit self-end"}
              type="link"
              href={`/tasks/${task.id}/edit`}
            >
              Edit
            </PrimaryButton>
          </div>

          {/* duration and priority */}
          <div className="flex flex-col text-sm">
            <p>{duration}</p>

            <p>Priority: {task.priority}</p>

            {task?.updatedBy && (
              <p className="self-end text-gray-600">
                Last edited by{" "}
                {users.find((item) => item.id == task.updatedBy)?.name} at{" "}
                {format(task.updatedAt, "d MMM y (hh:mm:ss aa)")}
              </p>
            )}
          </div>
        </div>

        {/* lower */}
        <p className="text-justify leading-6 tracking-wide">
          {task.description}
        </p>
      </div>

      {/* right section */}
      <div className="flex flex-col gap-5">
        <p className="text-sm font-bold">
          Division: {divisions.find((item) => item.id == task.division)?.name}
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
  );
};

export default ViewTask;
