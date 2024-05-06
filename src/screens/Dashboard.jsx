// import "react-calendar/dist/Calendar.css";
import AddIcon from "@mui/icons-material/Add";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import "../calendar.css";
import ReplyIcon from "@mui/icons-material/Reply";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Card from "../components/Card";
import TopBar from "../components/TopBar";
import PersonImg from "../assets/asd.jpg";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Calendar from "react-calendar";
import ActivityBox from "../components/ActivityBox";
import { activities, projects } from "../data";
import { useState } from "react";
import { format } from "date-fns";
import PrimaryButton from "../components/PrimaryButton";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const tasks = useSelector((state) => state.task.tasks);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = tasks.filter(
    (item) =>
      new Date(item.startDateTime).toDateString() ===
      selectedDate.toDateString(),
  );

  const pageSize = 6;
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIdx, startIdx + pageSize);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col">
      <TopBar />

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
            {filteredTasks.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {paginatedTasks.map((item, idx) => (
                  <Card key={idx} task={item} />
                ))}
              </div>
            )}

            {filteredTasks.length === 0 && (
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

              <div className="flex items-center gap-5 text-xs text-gray-500">
                <div className="flex cursor-pointer items-center gap-2 hover:text-gray-700">
                  <CloudDownloadIcon
                    sx={{
                      fontSize: "17px",
                    }}
                  />
                  <p>Export</p>
                </div>

                <div className="flex cursor-pointer items-center gap-2 hover:text-gray-700">
                  <ReplyIcon fontSize="small" />
                  <p>Share</p>
                </div>

                <div className="cursor-pointer">
                  <MoreHorizIcon
                    fontSize="large"
                    className="text-blue-900 hover:text-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* table */}
            <div>
              <TableContainer>
                <Table
                  sx={{
                    "th, td": {
                      border: 0,
                      fontFamily: "Merriweather, serif",
                      fontSize: "12px",
                    },
                    "tr th": {
                      backgroundColor: "#f9f7fc",
                      fontWeight: "bold",
                      color: "slategray",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Name</TableCell>
                      <TableCell>Deadline</TableCell>
                      <TableCell>Project Type</TableCell>
                      <TableCell>Project Team</TableCell>
                      <TableCell>Project Status</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {item.name}
                        </TableCell>
                        <TableCell>{item.deadline}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>
                          <div className="flex">
                            {item.team.map((item2, idx) => (
                              <img
                                key={idx}
                                src={PersonImg}
                                className={`${idx !== 0 ? "-ml-4" : ""} h-9 w-9 rounded-full border-2 border-white object-contain`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CheckCircleIcon sx={{ fontSize: "15px" }} />
                            <p>{item.status}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <MoreHorizIcon fontSize="large" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
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
