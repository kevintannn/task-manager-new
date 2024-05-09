/* eslint-disable react/prop-types */
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Person = ({ id, type, idx }) => {
  const user = useSelector((state) => state.auth.user);

  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const person = users.find((item) => item.id == id);

  const navigate = useNavigate();

  const handleClick = () => {
    if (user.id == person?.id) {
      return navigate("/profile");
    }

    return navigate(`/profile/${id}`);
  };

  useEffect(() => {
    setDivisions(
      localStorage.getItem("divisions")
        ? JSON.parse(localStorage.getItem("divisions"))
        : [],
    );
  }, []);

  useEffect(() => {
    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );
  }, []);

  return (
    <div
      className="flex cursor-pointer items-center gap-5 p-1 duration-100 hover:rounded-full hover:bg-blue-100"
      onClick={handleClick}
    >
      <img
        src={person?.imgPath}
        className="h-10 w-10 rounded-full object-cover"
      />

      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-bold">{person?.name}</p>
          <p className="text-xs text-gray-600">
            {divisions.find((item) => item.id == person?.divisionId)?.name}{" "}
            {type === "creator_label" && idx === 0 && "• Creator"}
          </p>
        </div>

        <CallMissedOutgoingIcon className="mr-3 text-blue-700" />
      </div>
    </div>
  );
};

export default Person;
