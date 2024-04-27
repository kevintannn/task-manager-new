/* eslint-disable react/prop-types */
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format } from "date-fns";

const types = {
  type1: "shadow-md hover:shadow-lg",
  type2: "bg-red-100/80 hover:shadow-lg",
  type3: "bg-blue-50 hover:shadow-lg",
};

const iconColors = {
  type1: "darkslateblue",
  type2: "brown",
  type3: "darkslateblue",
};

const iconBackgrounds = {
  type1: "bg-blue-100",
  type2: "bg-red-200/80",
  type3: "bg-blue-200/80",
};

const Card = ({ task }) => {
  const startTime = format(task.startdatetime, "hh:mm a");
  const endTime = format(task.enddatetime, "hh:mm a");
  const duration = `${startTime} - ${endTime}`;

  return (
    <div
      className={`${types[task.type]} flex min-h-36 min-w-60 cursor-pointer flex-col justify-between rounded-lg p-5 text-sm duration-150`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="min-w-40">{task.title}</p>
          <p className="text-xs text-gray-500">{duration}</p>
        </div>

        <MoreVertIcon />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {task.people.map((item, idx) => (
            <img
              key={idx}
              src={item.img}
              className={`${idx !== 0 ? "-ml-4" : ""} h-9 w-9 rounded-full border-2 border-white object-contain`}
            />
          ))}
        </div>

        <div
          className={`${iconBackgrounds[task.type]} flex items-center justify-center gap-3 rounded-md p-2`}
        >
          <CallIcon
            sx={{
              color: iconColors[task.type],
              fontSize: "15px",
            }}
          />
          <VideocamIcon
            sx={{
              color: iconColors[task.type],
              fontSize: "17px",
            }}
          />
          <ChatBubbleIcon
            sx={{
              color: iconColors[task.type],
              fontSize: "13px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
