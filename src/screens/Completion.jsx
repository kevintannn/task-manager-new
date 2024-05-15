import { Box, Paper } from "@mui/material";
import Person from "../components/Person";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Completion = () => {
  const tasks = useSelector((state) => state.task.tasks);
  const projects = useSelector((state) => state.project.projects);

  const [users, setUsers] = useState([]);

  const countCompletedTasks = tasks.filter((item) => item.completed).length;
  const countCompletedProjects = projects.filter(
    (item) => item.status === "completed",
  ).length;

  useEffect(() => {
    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );
  }, []);

  return (
    <div className="mt-5 flex flex-col items-center justify-center gap-10 pb-10">
      {/* header */}
      <h1 className="text-3xl font-bold">Completion Progress</h1>

      {/* total boxes */}
      <div className="flex items-center gap-5">
        {/* task box */}
        <Box
          component={Paper}
          elevation={2}
          className="flex cursor-pointer flex-col items-center gap-3 p-5 hover:scale-105"
          sx={{
            borderRadius: "10px",
            transition: "all",
            transitionDuration: "100ms",
          }}
        >
          <p className="font-semibold">Task Completion</p>

          <div className="text-center">
            <p>
              {countCompletedTasks} / {tasks.length}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="relative flex h-7 w-60 items-center rounded-lg bg-gray-300">
            <div
              className="absolute h-7 rounded-lg bg-blue-900"
              style={{
                width: `calc((${countCompletedTasks}/${tasks.length})*100%)`,
              }}
            ></div>
          </div>
        </Box>

        {/* project box */}
        <Box
          component={Paper}
          elevation={2}
          className="flex cursor-pointer flex-col items-center gap-3 p-5 hover:scale-105"
          sx={{
            borderRadius: "10px",
            transition: "all",
            transitionDuration: "100ms",
          }}
        >
          <p className="font-semibold">Project Completion</p>

          <div className="text-center">
            {countCompletedProjects} / {projects.length}
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="relative flex h-7 w-60 items-center rounded-lg bg-gray-300">
            <div
              className="absolute h-7 rounded-lg bg-blue-900"
              style={{
                width: `calc((${countCompletedProjects}/${projects.length})*100%)`,
              }}
            ></div>
          </div>
        </Box>
      </div>

      {/* progresses of people */}
      <div className="flex flex-col gap-5">
        {users.map((item, idx) => {
          const tasksOfUser = tasks.filter((item2) => {
            const existUserInPeople = item2.people.find(
              (item3) => item3 == item.id,
            );

            if (existUserInPeople) {
              return item2;
            }
          });

          const completedTasksOfUser = tasksOfUser.filter(
            (item) => item.completed,
          ).length;

          const projectsOfUser = projects.filter((item2) => {
            const existUserInPeople = item2.people.find(
              (item3) => item3 == item.id,
            );

            if (existUserInPeople) {
              return item2;
            }
          });

          const completedProjectsOfUser = projectsOfUser.filter(
            (item) => item.status === "completed",
          ).length;

          return (
            <div key={idx} className="flex items-center gap-20">
              {/* person */}
              <div className="w-[300px]">
                <Person id={item.id} />
              </div>

              {/* task and project completion */}
              <div className="flex items-center gap-5">
                {/* task completion */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative flex h-5 w-48 items-center rounded-md bg-gray-300">
                    <div
                      className="absolute h-5 rounded-md bg-orange-600"
                      style={{
                        width: `calc((${completedTasksOfUser}/${tasksOfUser.length})*100%)`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Completed {completedTasksOfUser} / {tasksOfUser.length}{" "}
                    Tasks
                  </p>
                </div>

                {/* project completion */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative flex h-5 w-48 items-center rounded-md bg-gray-300">
                    <div
                      className="absolute h-5 rounded-md bg-orange-600"
                      style={{
                        width: `calc((${completedProjectsOfUser}/${projectsOfUser.length})*100%)`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Completed {completedProjectsOfUser} /{" "}
                    {projectsOfUser.length} Projects
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Completion;
