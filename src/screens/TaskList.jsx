/* eslint-disable react/prop-types */
import CircleIcon from "@mui/icons-material/Circle";
import ListLayout from "./layouts/ListLayout";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { stringSort } from "../utils";
import { Link } from "react-router-dom";
import { Task } from "../components/Task";

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
          <div className="flex h-60 items-center justify-center rounded-xl text-gray-600">
            <p>There is no task</p>
          </div>
        ) : (
          tasksByDateGroup.map(
            (item, idx) =>
              item[Object.keys(item)].length > 0 && (
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
              ),
          )
        )}
      </div>
    </ListLayout>
  );
};

export default TaskList;
