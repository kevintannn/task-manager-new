import TopBar from "../components/TopBar";
import PrimaryButton from "../components/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";
import { uiActions } from "../store/uiSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { Task } from "../components/Task";
import ProjectsTable from "../components/ProjectsTable";
import { avatarImg, firebaseRealtimeDatabaseURL } from "../constants";
import { createActivity, getDatasFromAxios } from "../utils";
import PaginationButtons from "../components/PaginationButtons";
import axios from "axios";
import Loading from "../components/Loading";

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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const completedUserTasks = userTasks?.filter((item) => item.completed);
  const completedUserProjects = userProjects?.filter(
    (item) => item.status === "completed",
  );

  const pageSize = 5;
  const totalPages = Math.ceil(completedUserTasks?.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedTasks = completedUserTasks?.slice(
    startIdx,
    startIdx + pageSize,
  );

  const projectPageSize = 5;
  const projectTotalPages = Math.ceil(
    completedUserProjects?.length / projectPageSize,
  );
  const projectStartIdx = (projectCurrentPage - 1) * projectPageSize;
  const paginatedProjects = completedUserProjects?.slice(
    projectStartIdx,
    projectStartIdx + projectPageSize,
  );

  const logout = () => {
    try {
      dispatch(authActions.logout());
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

  const editDivisionId = async () => {
    // firebase
    axios
      .patch(`${firebaseRealtimeDatabaseURL}/users/${user.id}.json`, {
        divisionId,
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));

    // local storage
    // const existingUsersJSON = localStorage.getItem("users");
    // const existingUsers = existingUsersJSON
    //   ? JSON.parse(existingUsersJSON).map((item) => {
    //       if (item.id == user?.id) {
    //         return { ...item, divisionId };
    //       }

    //       return item;
    //     })
    //   : [];

    // localStorage.setItem("users", JSON.stringify(existingUsers));

    // if user is myself
    if (!id) {
      localStorage.setItem("user", JSON.stringify({ ...user, divisionId }));
      dispatch(authActions.changeDivisionId(divisionId));

      await createActivity(
        myself.id,
        `changed division from "${divisions.find((item) => item.id == user.divisionId).name}" to "${divisions.find((item) => item.id == divisionId).name}".`,
      );
    } else {
      await createActivity(
        myself.id,
        `changed ${user.name} division from "${divisions.find((item) => item.id == user.divisionId).name}" to "${divisions.find((item) => item.id == divisionId).name}".`,
      );
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

  // check if user is myself
  useEffect(() => {
    // const usersJSON = localStorage.getItem("users");
    // const users = usersJSON ? JSON.parse(usersJSON) : [];

    let user = myself;

    if (id) {
      axios
        .get(`${firebaseRealtimeDatabaseURL}/users/${id}.json`)
        .then((res) => {
          if (res.data) {
            user = { id, ...res.data };

            setUser(user);
            setDivisionId(user.divisionId);
            setUserTasks(tasks.filter((item) => item.people.includes(user.id)));
            setUserProjects(
              projects.filter((item) => item.people.includes(user.id)),
            );
          }
        })
        .catch((err) => console.log(err));
    } else {
      setUser(user);
      setDivisionId(user.divisionId);
      setUserTasks(tasks.filter((item) => item.people.includes(user.id)));
      setUserProjects(projects.filter((item) => item.people.includes(user.id)));
    }
  }, [id, myself, tasks, projects]);

  useEffect(() => {
    if (id == myself.id) {
      return navigate("/profile");
    }
  }, [id, myself.id, navigate]);

  useEffect(() => {
    setLoading(true);

    const getDivisions = async () => {
      setDivisions(await getDatasFromAxios("divisions"));
    };
    getDivisions().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-5 pb-20">
      <TopBar mode="only_profile" />

      {/* left and right */}
      <div className="flex justify-center gap-10">
        {/* left - profile */}
        <div className="flex w-fit flex-col gap-10 rounded-lg bg-blue-50 p-10">
          {/* image */}
          <img
            src={user.imgPath ?? avatarImg}
            className="h-40 w-40 self-center rounded-lg object-cover"
          />

          {/* details */}
          <div className="grid grid-cols-2 gap-5 gap-x-10">
            {!id
              ? Object.keys(user).map(
                  (item, idx) =>
                    !["imgPath", "divisionId", "password"].includes(item) && (
                      <div key={idx} className="flex flex-col">
                        <p className="font-bold">{formatFieldName(item)}</p>
                        <p className="text-sm">
                          {item === "gender"
                            ? user[item][0].toUpperCase() + user[item].slice(1)
                            : user[item]}
                        </p>
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
                      "password",
                    ].includes(item) && (
                      <div key={idx} className="flex flex-col">
                        <p className="font-bold">{formatFieldName(item)}</p>
                        <p className="text-sm">
                          {item === "gender"
                            ? user[item][0].toUpperCase() + user[item].slice(1)
                            : user[item]}
                        </p>
                      </div>
                    ),
                )}
          </div>

          {/* change profile and logout buttons */}
          <div className="flex items-center justify-center gap-3">
            <PrimaryButton cname="self-center" href="/profile/edit">
              Change Profile
            </PrimaryButton>

            <PrimaryButton
              cname="self-center bg-red-600 hover:bg-red-700"
              handleClick={logout}
            >
              Logout
            </PrimaryButton>
          </div>
        </div>

        {/* right - division and completions */}
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
                    width: `calc((${completedUserTasks.length}/${userTasks.length})*100%)`,
                  }}
                ></div>
              </div>

              <p className="text-xs text-gray-500">
                Completed {completedUserTasks.length} / {userTasks.length} Tasks
              </p>
            </div>

            {/* project completion */}
            <div className="flex w-full flex-col items-center gap-1">
              <div className="relative flex h-5 w-full items-center rounded-md bg-gray-300">
                <div
                  className="absolute h-5 rounded-md bg-orange-600"
                  style={{
                    width: `calc((${completedUserProjects.length}/${userProjects.length})*100%)`,
                  }}
                ></div>
              </div>

              <p className="text-xs text-gray-500">
                Completed {completedUserProjects.length} / {userProjects.length}{" "}
                Projects
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
        {paginatedTasks.length > 0 && (
          <div className="flex flex-col gap-3">
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
            <PaginationButtons
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}

        {/* no task message box */}
        {paginatedTasks.length === 0 && (
          <div className="flex h-60 items-center justify-center rounded-xl bg-blue-100 text-gray-600">
            <p className="text-gray-700">There is no task</p>
          </div>
        )}
      </div>

      {/* completed projects */}
      <div className="mx-10 flex flex-col gap-5">
        {/* header */}
        <h1 className="text-xl font-bold">Completed Projects</h1>

        {/* projects */}
        {paginatedProjects.length > 0 && (
          <div className="flex flex-col gap-3">
            <ProjectsTable projects={paginatedProjects} />

            {/* pagination buttons */}
            <PaginationButtons
              currentPage={projectCurrentPage}
              setCurrentPage={setProjectCurrentPage}
              totalPages={projectTotalPages}
            />
          </div>
        )}

        {/* no project message box */}
        {paginatedProjects.length === 0 && (
          <div className="flex h-60 items-center justify-center rounded-xl bg-blue-100">
            <p className="text-gray-700">There is no project</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
