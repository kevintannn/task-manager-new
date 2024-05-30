/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { avatarImg } from "../constants";
import clsx from "clsx";
import { getDatasFromAxios } from "../utils";

const ActivityBox = ({ activities, cname, limit, showModal, closeModal }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      setUsers(await getDatasFromAxios("users"));
    };
    getUsers();
  }, []);

  return (
    <div
      className={clsx(cname, "flex flex-col rounded-lg bg-blue-50 p-5 text-xs")}
    >
      {/* header */}
      <div className="flex items-center justify-between border-b-2 border-b-gray-200 pb-3">
        <h1 className="text-lg font-bold">Activity</h1>
        {limit ? (
          <p
            className="cursor-pointer text-sm text-blue-700 hover:text-blue-500"
            onClick={showModal}
          >
            See All
          </p>
        ) : (
          <div className="cursor-pointer" onClick={closeModal}>
            <CloseIcon />
          </div>
        )}
      </div>

      {/* content */}
      {activities.map((item, idx) => {
        const render = idx < limit || !limit;

        return (
          render && (
            <div key={idx} className="mt-3 flex items-center gap-3">
              <img
                src={
                  users?.find((item2) => item2.id == item.person)?.imgPath ??
                  avatarImg
                }
                className="h-10 w-10 self-start rounded-lg object-cover"
              />

              <div className="flex flex-1 flex-col gap-1 text-gray-500">
                <p>
                  <span className="font-bold text-black">
                    {
                      users
                        ?.find((item2) => item2.id == item.person)
                        ?.name.split(" ")[0]
                    }
                  </span>{" "}
                  {item.activity}
                </p>

                <p className="text-[10px]">
                  {formatDistanceToNow(item.updatedAt) + " ago"}
                </p>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default ActivityBox;
