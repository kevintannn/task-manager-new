/* eslint-disable react/prop-types */
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircleIcon from "@mui/icons-material/Circle";
import ListLayout from "./layouts/ListLayout";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getDuration, stringSort } from "../utils";
import { Link } from "react-router-dom";
import { deleteTask } from "../store/taskActions";
import { useEffect, useState } from "react";

const getUniqueDateGroup = (tasks) => {
  const dateGroup = tasks.flatMap((item) => [
    new Date(new Date(item.startDateTime).toDateString()).toString(),
    new Date(new Date(item.endDateTime).toDateString()).toString(),
  ]); // needs .toString() in order for js to read is as string and can actually compare string to string

  const uniqueDateGroup = dateGroup.filter(
    (item, idx) => dateGroup.indexOf(item) === idx,
  );

  return uniqueDateGroup;
};

const TaskList = () => {
  const tasks = useSelector((state) => state.task.tasks);
  const limit20Tasks = tasks.slice(0, 20);

  const dateGroup = getUniqueDateGroup(limit20Tasks).map((item) =>
    format(new Date(item), "yyyy-MM-dd"),
  );
  const sortedDateGroup = stringSort(dateGroup, "desc");

  const tasksByDateGroup = sortedDateGroup.map((item) => {
    return {
      [item]: limit20Tasks.filter((item2) => {
        const startDate = new Date(
          new Date(item2.startDateTime).toDateString(),
        ); // the purpose of nesting new Date() is to set the hours to 00:00:00 so we only compare date
        const endDate = new Date(new Date(item2.endDateTime).toDateString());
        const selectedDate = new Date(new Date(item).toDateString());

        if (startDate <= selectedDate && endDate >= selectedDate) {
          return item2;
        }
      }),
    };
  });

  const isToday = (yyyyMMdd) => {
    const date = new Date(yyyyMMdd).toDateString();
    const today = new Date().toDateString();

    if (date === today) {
      return true;
    }

    return false;
  };

  return (
    <ListLayout>
      <div className="flex flex-col gap-7">
        {/* header */}
        <h1 className="text-4xl font-bold">Task List</h1>

        {/* date and tasks */}
        {tasksByDateGroup.length <= 0 ? (
          <div className="flex h-60 items-center justify-center rounded-xl bg-blue-100 text-gray-600">
            <p>There is no task</p>
          </div>
        ) : (
          tasksByDateGroup.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              {/* date */}
              <p className="text-lg font-bold">
                {isToday(Object.keys(item))
                  ? "Today's Tasks"
                  : `${format(new Date(Object.keys(item)), "E, dd MMM yyyy")}`}
              </p>

              {/* tasks */}
              {item[Object.keys(item)].map((item2, idx) => (
                <Link
                  key={idx}
                  to={`/tasks/${item2.id}`}
                  className="flex cursor-pointer items-center gap-3 rounded-xl bg-blue-50 p-3 shadow-sm hover:shadow-md"
                >
                  <CircleIcon
                    sx={{
                      fontSize: "15px",
                      marginLeft: "15px",
                      marginRight: "15px",
                      color: "darkslategray",
                    }}
                  />

                  <Task task={item2} />
                </Link>
              ))}
            </div>
          ))
        )}
      </div>
    </ListLayout>
  );
};

export default TaskList;

const Task = ({ task }) => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const startDateTime = new Date(task.startDateTime);
  const endDateTime = new Date(task.endDateTime);

  const duration = getDuration(startDateTime, endDateTime);

  const handleDeleteTask = () => {
    if (!confirm("Confirm delete task? (can not be undone)")) {
      return;
    }

    dispatch(deleteTask(task.id));
  };

  useEffect(() => {
    setDivisions(
      localStorage.getItem("divisions")
        ? JSON.parse(localStorage.getItem("divisions"))
        : [],
    );

    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );
  }, []);

  return (
    <div className="flex w-full items-center">
      {/* left section */}
      <div className="flex w-[400px] flex-col gap-1">
        {/* title */}
        <p className="font-semibold">{task.title}</p>

        {/* division */}
        <div className="w-fit rounded-full border-2 border-blue-700 bg-blue-100">
          <p className="p-1 px-3 text-xs text-blue-700">
            {divisions.find((item) => item.id == task.division)?.name}
          </p>
        </div>
      </div>

      {/* right section */}
      <div className="flex flex-1 items-center justify-between">
        {/* user images */}
        <div className="mb-2 flex w-[200px] items-center">
          {task.people.map((item, idx) => (
            <img
              key={idx}
              src={users.find((item2) => item2.id == item)?.imgPath}
              className={`${idx !== 0 ? "-ml-4" : ""} h-10 w-10 rounded-full border-[3px] border-white object-cover`}
            />
          ))}
        </div>

        {/* duration */}
        <p className="w-[400px] text-sm text-gray-600">{duration}</p>

        {/* action icons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${task.id}/edit`}
            className="cursor-pointer rounded-md bg-green-600 hover:bg-green-700"
          >
            <ModeEditIcon
              className="p-1 text-white"
              sx={{
                fontSize: "30px",
              }}
            />
          </Link>

          <div
            className="cursor-pointer rounded-md bg-red-600 hover:bg-red-700"
            onClick={handleDeleteTask}
          >
            <DeleteForeverIcon
              className="p-1 text-white"
              sx={{
                fontSize: "30px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
