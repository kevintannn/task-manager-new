import TopBar from "../components/TopBar";
import PrimaryButton from "../components/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";
import { uiActions } from "../store/uiSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { Task } from "../components/Task";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ProjectsTable from "../components/ProjectsTable";

const formatFieldName = (fieldName) => {
  if (fieldName === "id") {
    return "ID";
  }

  if (fieldName === "contactNumber") {
    return "Contact Number";
  }

  const replacedUnderscores = fieldName.replace(/_/g, " ");
  const words = replacedUnderscores.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  return capitalizedWords.join(" ");
};

const Profile = () => {
  const { id } = useParams();

  const myself = useSelector((state) => state.auth.user);
  const tasks = useSelector((state) => state.task.tasks);
  const projects = useSelector((state) => state.project.projects);
  const dispatch = useDispatch();

  const [user, setUser] = useState({});

  const [divisions, setDivisions] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [disableDivisionSelect, setDisableDivisionSelect] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userTasks, setUserTasks] = useState([]);
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [userProjects, setUserProjects] = useState([]);

  const navigate = useNavigate();

  const pageSize = 5;
  const totalPages = Math.ceil(userTasks?.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedTasks = userTasks?.slice(startIdx, startIdx + pageSize);

  const projectPageSize = 5;
  const projectTotalPages = Math.ceil(userProjects?.length / projectPageSize);
  const projectStartIdx = (projectCurrentPage - 1) * projectPageSize;
  const paginatedProjects = userProjects?.slice(
    projectStartIdx,
    projectStartIdx + projectPageSize,
  );

  const logout = () => {
    dispatch(authActions.logout());
    try {
      localStorage.removeItem("user");

      dispatch(
        uiActions.setNotification({
          type: "success",
          message: "You are logged out!",
          open: true,
        }),
      );
    } catch (error) {
      dispatch(
        uiActions.setNotification({
          type: "error",
          message: "Something went wrong.",
          open: true,
        }),
      );
    }
  };

  const editDivisionId = () => {
    const existingUsersJSON = localStorage.getItem("users");
    const existingUsers = existingUsersJSON
      ? JSON.parse(existingUsersJSON).map((item) => {
          if (item.id == user?.id) {
            return { ...item, divisionId };
          }

          return item;
        })
      : [];

    localStorage.setItem("users", JSON.stringify(existingUsers));

    // if user is myself
    if (!id) {
      const existingUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;

      existingUser.divisionId = divisionId;
      localStorage.setItem("user", JSON.stringify(existingUser));

      dispatch(authActions.changeDivisionId(divisionId));
    }

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Division changed!",
        open: true,
      }),
    );

    setDisableDivisionSelect(true);
  };

  useEffect(() => {
    const usersJSON = localStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    let user = myself;

    if (id) {
      const { password, ...userWithoutPassword } = users.find(
        (item) => item.id == id,
      );
      user = userWithoutPassword;
    }

    setUser(user);
    setDivisionId(user.divisionId);

    setUserTasks(
      tasks.filter((item) => {
        if (!item.completed) {
          return;
        }

        const existUserInPeople = item.people.find((item2) => item2 == user.id);

        if (existUserInPeople) {
          return item;
        }
      }),
    );

    setUserProjects(
      projects.filter((item) => {
        if (!item.status === "completed") {
          return;
        }

        const existUserInPeople = item.people.find((item2) => item2 == user.id);

        if (existUserInPeople) {
          return item;
        }
      }),
    );
  }, [id, myself, tasks, projects]);

  useEffect(() => {
    if (id == myself.id) {
      return navigate("/profile");
    }
  }, [id, myself.id, navigate]);

  useEffect(() => {
    setDivisions(
      localStorage.getItem("divisions")
        ? JSON.parse(localStorage.getItem("divisions"))
        : [],
    );
  }, []);

  return (
    <div className="flex flex-col gap-5 pb-20">
      <TopBar mode="only_profile" />

      {/* left and right */}
      <div className="flex justify-center gap-10">
        {/* profile */}
        <div className="flex w-fit flex-col gap-10 rounded-lg bg-blue-50 p-10">
          {/* image */}
          <img
            src={user?.imgPath}
            className="h-40 w-40 self-center rounded-lg object-cover"
          />

          {/* details */}
          <div className="grid grid-cols-2 gap-5 gap-x-10">
            {!id
              ? Object.keys(user).map(
                  (item, idx) =>
                    !["imgPath", "divisionId"].includes(item) && (
                      <div key={idx} className="flex flex-col">
                        <p className="font-bold">{formatFieldName(item)}</p>
                        <p className="text-sm">{user[item]}</p>
                      </div>
                    ),
                )
              : Object.keys(user).map(
                  (item, idx) =>
                    ![
                      "contactNumber",
                      "username",
                      "imgPath",
                      "divisionId",
                    ].includes(item) && (
                      <div key={idx} className="flex flex-col">
                        <p className="font-bold">{formatFieldName(item)}</p>
                        <p className="text-sm">{user[item]}</p>
                      </div>
                    ),
                )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <PrimaryButton cname="self-center">Change Profile</PrimaryButton>

            <PrimaryButton
              cname="self-center bg-red-600 hover:bg-red-700"
              handleClick={logout}
            >
              Logout
            </PrimaryButton>
          </div>
        </div>

        {/* division and completions */}
        <div className="flex w-[250px] flex-col gap-7">
          {/* division */}
          <div className="flex h-fit flex-col gap-3 rounded-lg bg-blue-50 p-10">
            <p>Division</p>

            <select
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              value={divisionId}
              onChange={(e) => setDivisionId(e.target.value)}
              disabled={disableDivisionSelect}
            >
              {divisions.map((item, idx) => (
                <option key={idx} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {disableDivisionSelect && (
              <PrimaryButton
                cname={"justify-center"}
                handleClick={() => setDisableDivisionSelect(false)}
              >
                Change Division
              </PrimaryButton>
            )}

            {!disableDivisionSelect && (
              <div className="flex w-full items-center gap-1">
                <PrimaryButton
                  cname={"justify-center w-full"}
                  handleClick={editDivisionId}
                >
                  Save
                </PrimaryButton>

                <PrimaryButton
                  cname={"justify-center w-full bg-red-700 hover:bg-red-600"}
                  handleClick={() => {
                    setDivisionId(user?.divisionId);
                    setDisableDivisionSelect(true);
                  }}
                >
                  Cancel
                </PrimaryButton>
              </div>
            )}
          </div>

          {/* task and project completion */}
          <div className="flex flex-col items-center gap-3">
            {/* task completion */}
            <div className="flex w-full flex-col items-center gap-1">
              <div className="relative flex h-5 w-full items-center rounded-md bg-gray-300">
                <div
                  className="absolute h-5 rounded-md bg-orange-600"
                  style={{
                    width: `calc((${12}/${33})*100%)`,
                  }}
                ></div>
              </div>

              <p className="text-xs text-gray-500">
                Completed {12} / {33} Tasks
              </p>
            </div>

            {/* project completion */}
            <div className="flex w-full flex-col items-center gap-1">
              <div className="relative flex h-5 w-full items-center rounded-md bg-gray-300">
                <div
                  className="absolute h-5 rounded-md bg-orange-600"
                  style={{
                    width: `calc((${21}/${43})*100%)`,
                  }}
                ></div>
              </div>

              <p className="text-xs text-gray-500">
                Completed {21} / {43} Projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* completed tasks */}
      <div className="mx-10 flex flex-col gap-5">
        {/* header */}
        <h1 className="text-xl font-bold">Completed Tasks</h1>

        {/* tasks */}
        <div className="flex flex-col gap-3">
          {paginatedTasks.map((item, idx) => (
            <Link
              key={idx}
              to={`/tasks/${item.id}`}
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

              <Task task={item} type="no_action" />
            </Link>
          ))}
        </div>

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
              <ArrowCircleLeftIcon fontSize="large" className="text-blue-950" />
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

      {/* completed projects */}
      <div className="mx-10 flex flex-col gap-5">
        {/* header */}
        <h1 className="text-xl font-bold">Completed Projects</h1>

        {/* projects */}
        <ProjectsTable projects={paginatedProjects} />

        {/* pagination buttons */}
        <div className="flex items-center gap-3 self-end text-xs">
          <p>
            Page {projectTotalPages === 0 ? 0 : projectCurrentPage} of{" "}
            {projectTotalPages}
          </p>

          <div className="flex cursor-pointer items-center gap-1">
            <div
              onClick={() =>
                setProjectCurrentPage((prev) => {
                  if (prev === 1) {
                    return prev;
                  }

                  return prev - 1;
                })
              }
            >
              <ArrowCircleLeftIcon fontSize="large" className="text-blue-950" />
            </div>

            <div
              onClick={() =>
                setProjectCurrentPage((prev) => {
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
    </div>
  );
};

export default Profile;