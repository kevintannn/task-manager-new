import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircleIcon from "@mui/icons-material/Circle";
import PeopleImg from "../assets/asd.jpg";
import ListLayout from "./layouts/ListLayout";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { stringSort } from "../utils";

const getUniqueDateGroup = (tasks) => {
  const dateGroup = tasks.map((item) =>
    new Date(new Date(item.startDateTime).toDateString()).toString(),
  ); // needs .toString() in order for js to read is as string and can actually compare string to string

  const uniqueDateGroup = dateGroup.filter(
    (item, idx) => dateGroup.indexOf(item) === idx,
  );

  return uniqueDateGroup;
};

const TaskList = () => {
  const tasks = useSelector((state) => state.task.tasks);

  const dateGroup = getUniqueDateGroup(tasks).map((item) =>
    format(new Date(item), "yyyy-MM-dd"),
  );
  const sortedDateGroup = stringSort(dateGroup, "desc");

  const tasksByDateGroup = sortedDateGroup.map((item) => {
    return {
      [item]: tasks.filter((item2) => {
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

  console.log(tasksByDateGroup);

  // TODO: continue here

  return (
    <ListLayout>
      <div className="flex flex-col gap-7">
        {/* header */}
        <h1 className="text-4xl font-bold">Task List</h1>

        {/* date and tasks */}
        {[1, 2, 3].map((item, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {/* date */}
            <p className="text-xl font-bold">Today&apos;s Tasks</p>

            {/* tasks */}
            {[1, 2, 3].map((item, idx) => (
              <div
                key={idx}
                className="flex cursor-default items-center gap-3 rounded-xl p-3 shadow-md hover:shadow-lg"
              >
                <CircleIcon
                  sx={{
                    fontSize: "15px",
                    marginLeft: "15px",
                    marginRight: "15px",
                    color: "darkslategray",
                  }}
                />

                <Task />
              </div>
            ))}
          </div>
        ))}
      </div>
    </ListLayout>
  );
};

export default TaskList;

const Task = () => {
  return (
    <div className="flex w-full items-center">
      {/* left section */}
      <div className="flex w-[400px] flex-col gap-1">
        {/* title */}
        <p className="font-semibold">Do nothing and chill</p>

        {/* division */}
        <div className="w-fit rounded-full border-2 border-blue-700 bg-blue-100">
          <p className="p-1 px-3 text-xs text-blue-700">Division</p>
        </div>
      </div>

      {/* right section */}
      <div className="flex flex-1 items-center justify-between">
        {/* user images */}
        <div className="mb-2 flex w-[200px] items-center">
          {[1, 2, 3, 4].map((item, idx) => (
            <img
              key={idx}
              src={PeopleImg}
              className={`${idx !== 0 ? "-ml-4" : ""} h-10 w-10 rounded-full border-[3px] border-white object-cover`}
            />
          ))}
        </div>

        {/* duration */}
        <p className="w-[400px] text-sm text-gray-600">
          Thursday, 20 May 2002, 10:00 PM - Saturday, 24 May 2002, 11:00 PM
        </p>

        {/* action icons */}
        <div className="flex items-center gap-2">
          <div className="cursor-pointer rounded-md bg-green-600 hover:bg-green-700">
            <ModeEditIcon
              className="p-1 text-white"
              sx={{
                fontSize: "30px",
              }}
            />
          </div>

          <div className="cursor-pointer rounded-md bg-red-600 hover:bg-red-700">
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
