// import "react-calendar/dist/Calendar.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import "../calendar.css";
import Card from "../components/Card";
import TopBar from "../components/TopBar";
import Calendar from "react-calendar";
import ActivityBox from "../components/ActivityBox";
import { activities } from "../data";
import { useState } from "react";
import { format } from "date-fns";
import PrimaryButton from "../components/PrimaryButton";
import { useSelector } from "react-redux";
import ProjectsTable from "../components/ProjectsTable";
import { Link } from "react-router-dom";
import IconLabel from "../components/IconLabel";

const Dashboard = () => {
  const tasks = useSelector((state) => state.task.tasks);
  const projects = useSelector((state) => state.project.projects);

  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().toDateString()),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((item) => {
    const startDate = new Date(new Date(item.startDateTime).toDateString()); // the purpose of nesting new Date() is to set the hours to 00:00:00 so we only compare date
    const endDate = new Date(new Date(item.endDateTime).toDateString());

    if (startDate <= selectedDate && endDate >= selectedDate) {
      return item;
    }
  });

  const searchedTasks = filteredTasks.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const pageSize = 6;
  const totalPages = Math.ceil(searchedTasks.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedTasks = searchedTasks.slice(startIdx, startIdx + pageSize);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col">
      <TopBar search={search} setSearch={setSearch} />

      {/* left and right section */}
      <div className="my-10 flex gap-5">
        {/* left section */}
        <div className="flex flex-1 flex-col gap-10">
          {/* left section one */}
          <div className="flex flex-col gap-5">
            {/* header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">
                {isToday
                  ? "Today's Task"
                  : "Task of " + format(selectedDate, "dd MMMM yyyy")}
              </h1>

              <PrimaryButton type="link" href={"/tasks/create"}>
                <AddIcon className="absolute -mt-0.5" fontSize="small" />
                <span className="ml-7 mr-1">Create New Task</span>
              </PrimaryButton>
            </div>

            {/* cards */}
            {searchedTasks.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {paginatedTasks.map((item, idx) => (
                  <Card key={idx} task={item} />
                ))}
              </div>
            )}

            {searchedTasks.length === 0 && (
              <div className="flex h-60 items-center justify-center rounded-xl bg-blue-100 text-gray-600">
                <p>There is no task</p>
              </div>
            )}

            {/* pagination buttons */}
            <div className="flex items-center gap-3 self-end text-xs">
              <p>
                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </p>

              <div className="flex cursor-pointer items-center gap-1">
                <div
                  onClick={() =>
                    setCurrentPage((prev) => {
                      if (prev === 1) {
                        return prev;
                      }

                      return prev - 1;
                    })
                  }
                >
                  <ArrowCircleLeftIcon
                    fontSize="large"
                    className="text-blue-950"
                  />
                </div>

                <div
                  onClick={() =>
                    setCurrentPage((prev) => {
                      if (prev === totalPages) {
                        return prev;
                      }

                      return prev + 1;
                    })
                  }
                >
                  <ArrowCircleRightIcon
                    fontSize="large"
                    className="text-blue-950"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* left section two */}
          <div className="flex flex-col gap-3">
            {/* header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Projects</h1>

              <div className="flex items-center gap-5 text-xs">
                <IconLabel type="export" hoverable={true} />

                <IconLabel type="share" hoverable={true} />

                <Link
                  to="/projects/create"
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-950 p-1.5 px-2 text-white hover:bg-blue-900"
                >
                  <AddCircleIcon />

                  <p className="mr-1">Create</p>
                </Link>
              </div>
            </div>

            {/* table */}
            <ProjectsTable projects={projects} />
          </div>
        </div>

        {/* right section */}
        <div className="flex w-[300px] flex-col gap-10">
          <Calendar onChange={(e) => setSelectedDate(new Date(e))} />

          <ActivityBox activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
