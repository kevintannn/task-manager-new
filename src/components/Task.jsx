/* eslint-disable react/prop-types */
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useDispatch } from "react-redux";
import { getDuration } from "../utils";
import { deleteTask } from "../store/taskActions";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { avatarImg } from "../constants";

export const Task = ({ task, type = "action" }) => {
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
              src={users.find((item2) => item2.id == item)?.imgPath ?? avatarImg}
              className={`${idx !== 0 ? "-ml-4" : ""} h-10 w-10 rounded-full border-[3px] border-white object-cover`}
            />
          ))}
        </div>

        {/* duration */}
        <p className="w-[400px] text-sm text-gray-600">{duration}</p>

        {/* action icons */}
        {type === "action" && (
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
        )}

        {/* action icons - type no_action */}
        {type === "no_action" && (
          <CallMissedOutgoingIcon className="mr-3 text-blue-700" />
        )}
      </div>
    </div>
  );
};
