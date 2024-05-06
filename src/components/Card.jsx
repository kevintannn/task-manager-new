/* eslint-disable react/prop-types */
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format } from "date-fns";
import PersonImg from "../assets/asd.jpg";
import { Link } from "react-router-dom";
import { users } from "../data";

const types = {
  high: "shadow-md hover:shadow-lg",
  medium: "bg-red-100/80 hover:shadow-lg",
  low: "bg-blue-50 hover:shadow-lg",
};

const iconColors = {
  high: "darkslateblue",
  medium: "brown",
  low: "darkslateblue",
};

const iconBackgrounds = {
  high: "bg-blue-100",
  medium: "bg-red-200/80",
  low: "bg-blue-200/80",
};

// const types = {
//   high: "bg-blue-50 hover:shadow-lg",
//   medium: "bg-blue-50 hover:shadow-lg",
//   low: "bg-blue-50 hover:shadow-lg",
// };

// const iconColors = {
//   high: "darkslateblue",
//   medium: "darkslateblue",
//   low: "darkslateblue",
// };

// const iconBackgrounds = {
//   high: "bg-blue-200/80",
//   medium: "bg-blue-200/80",
//   low: "bg-blue-200/80",
// };

const Card = ({ task }) => {
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

  return (
    <Link
      to={`/tasks/${task.id}`}
      className={`${types[task.priority]} flex min-h-40 min-w-60 cursor-pointer flex-col justify-between rounded-lg p-5 text-sm duration-150`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="min-w-40">{task.title}</p>
          <p className="text-xs text-gray-500">{duration}</p>
        </div>

        <MoreVertIcon />
      </div>

      <div className="flex flex-col gap-1">
        {/* completed mark */}
        {task.completed && (
          <p className="w-fit rounded-full bg-green-600 p-1 px-2 text-xs text-white">
            Done
          </p>
        )}

        {/* people avatars and call icons */}
        <div className="flex items-center justify-between">
          {/* people avatars */}
          <div className="flex items-center">
            {task.people.map((item, idx) => (
              <img
                key={idx}
                src={users.find((item2) => item2.id == item)?.imgPath}
                className={`${idx !== 0 ? "-ml-4" : ""} h-9 w-9 rounded-full border-2 border-white object-cover`}
              />
            ))}
          </div>

          {/* call icons */}
          <div
            className={`${iconBackgrounds[task.priority]} flex items-center justify-center gap-3 rounded-md p-2`}
          >
            <CallIcon
              sx={{
                color: iconColors[task.priority],
                fontSize: "15px",
              }}
            />
            <VideocamIcon
              sx={{
                color: iconColors[task.priority],
                fontSize: "17px",
              }}
            />
            <ChatBubbleIcon
              sx={{
                color: iconColors[task.priority],
                fontSize: "13px",
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
