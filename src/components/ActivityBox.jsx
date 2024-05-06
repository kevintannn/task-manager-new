/* eslint-disable react/prop-types */
import { formatDistanceToNow } from "date-fns";

const ActivityBox = ({ activities }) => {
  return (
    <div className="flex flex-col rounded-lg bg-blue-50/50 p-5 text-xs">
      {/* header */}
      <div className="flex items-center justify-between border-b-2 border-b-gray-200 pb-3">
        <h1 className="text-lg font-bold">Activity</h1>
        <p className="text-sm text-blue-800">See All</p>
      </div>

      {/* content */}
      {activities.map(
        (item, idx) =>
          idx < 6 && (
            <div key={idx} className="mt-3 flex items-center gap-5">
              <img
                src={item.img}
                className="h-10 w-10 rounded-lg object-cover"
              />

              <div className="flex flex-col gap-1 text-gray-500">
                <p>
                  <span className="font-bold text-black">
                    {item.name.split(" ")[0]}
                  </span>{" "}
                  {item.activity}
                </p>

                <p className="text-[10px]">
                  {formatDistanceToNow(item.datetime) + " ago"}
                </p>
              </div>
            </div>
          ),
      )}
    </div>
  );
};

export default ActivityBox;
