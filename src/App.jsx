/* eslint-disable react/prop-types */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUser } from "./store/authActions";
import { getTasks } from "./store/taskActions";
import { Alert, Snackbar } from "@mui/material";
import { uiActions } from "./store/uiSlice";
import { getProjects } from "./store/projectActions";
import { divisions, projectTypes, users } from "./data";
import axios from "axios";
import { firebaseRealtimeDatabaseURL } from "./constants";

const App = () => {
  const { pathname } = useLocation();

  const auth = useSelector((state) => state.auth);
  const notification = useSelector((state) => state.ui.notification);
  const loading = useSelector((state) => state.ui.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());

    const getInitialDatas = async () => {
      await dispatch(getTasks());
      await dispatch(getProjects());
    };
    getInitialDatas().finally(() => dispatch(uiActions.setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    // const existingDivisionsJSON = localStorage.getItem("divisions");
    // const existingUsersJSON = localStorage.getItem("users");
    // const existingTasksJSON = localStorage.getItem("tasks");
    // const existingProjectsJSON = localStorage.getItem("projects");
    // const existingDiscussionsJSON = localStorage.getItem("discussions");

    // if (!existingDivisionsJSON) {
    //   localStorage.setItem("divisions", JSON.stringify(divisions));
    // }

    // if (!existingUsersJSON) {
    //   localStorage.setItem("users", JSON.stringify(users));
    // }

    // if (!existingTasksJSON) {
    //   localStorage.setItem("tasks", JSON.stringify(tasks));
    // }

    // if (!existingProjectsJSON) {
    //   localStorage.setItem("projects", JSON.stringify(projects));
    // }

    // if (!existingDiscussionsJSON) {
    //   localStorage.setItem("discussions", JSON.stringify(discussions));
    // }

    // firebase
    axios
      .get(`${firebaseRealtimeDatabaseURL}/users.json`)
      .then((res) => {
        const existingUsers = res.data;

        if (!existingUsers) {
          Promise.all(
            users.map((item) =>
              axios.post(`${firebaseRealtimeDatabaseURL}/users.json`, item),
            ),
          )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(`${firebaseRealtimeDatabaseURL}/divisions.json`)
      .then((res) => {
        const existingDivisions = res.data;

        if (!existingDivisions) {
          Promise.all(
            divisions.map((item) =>
              axios.post(`${firebaseRealtimeDatabaseURL}/divisions.json`, item),
            ),
          )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(`${firebaseRealtimeDatabaseURL}/projectTypes.json`)
      .then((res) => {
        const existingProjectTypes = res.data;

        if (!existingProjectTypes) {
          Promise.all(
            projectTypes.map((item) =>
              axios.post(
                `${firebaseRealtimeDatabaseURL}/projectTypes.json`,
                item,
              ),
            ),
          )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    // axios
    //   .get(`${firebaseRealtimeDatabaseURL}/tasks.json`)
    //   .then((res) => {
    //     const existingTasks = res.data;

    //     if (!existingTasks) {
    //       Promise.all(
    //         tasks.map((item) =>
    //           axios.post(`${firebaseRealtimeDatabaseURL}/tasks.json`, item),
    //         ),
    //       )
    //         .then((res) => console.log(res))
    //         .catch((err) => console.log(err));
    //     }
    //   })
    //   .catch((err) => console.log(err));

    // axios
    //   .get(`${firebaseRealtimeDatabaseURL}/projects.json`)
    //   .then((res) => {
    //     const existingProjects = res.data;

    //     if (!existingProjects) {
    //       Promise.all(
    //         projects.map((item) =>
    //           axios.post(`${firebaseRealtimeDatabaseURL}/projects.json`, item),
    //         ),
    //       )
    //         .then((res) => console.log(res))
    //         .catch((err) => console.log(err));
    //     }
    //   })
    //   .catch((err) => console.log(err));

    // axios
    //   .get(`${firebaseRealtimeDatabaseURL}/discussions.json`)
    //   .then((res) => {
    //     const existingDiscussions = res.data;

    //     if (!existingDiscussions) {
    //       Promise.all(
    //         discussions.map((item) =>
    //           axios.post(
    //             `${firebaseRealtimeDatabaseURL}/discussions.json`,
    //             item,
    //           ),
    //         ),
    //       )
    //         .then((res) => console.log(res))
    //         .catch((err) => console.log(err));
    //     }
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  return loading ? (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <svg
        aria-hidden="true"
        className="inline h-10 w-10 animate-spin fill-yellow-400 text-gray-200"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>

      <p className="animate-bounce text-sm font-bold">Loading</p>
    </div>
  ) : (
    <>
      <Notification notification={notification} />

      {!auth.user.id && <Navigate to="/login" />}
      {!auth.user.id && pathname === "/register" && <Navigate to="/register" />}

      {!auth.user.id && ["/login", "/register"].includes(pathname) && (
        <Outlet />
      )}

      {auth.user.id && (
        <div className="flex h-screen">
          {/* 
            for sidebar to be fixed,
            there needs to be a background width of 84px,
            84px is got by inspecting sidebar before position: fixed;
            and it's calculated by the width of sidebar plus padding
            */}
          <div className="w-[84px]">
            <Sidebar />
          </div>

          <div className="m-5 flex-1">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default App;

const Notification = ({ notification }) => {
  const dispatch = useDispatch();

  return (
    <Snackbar
      autoHideDuration={10000}
      onClose={(e, reason) => {
        if (reason === "timeout") {
          dispatch(uiActions.closeNotification());
        }
      }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={notification.open}
    >
      <Alert
        onClose={() => dispatch(uiActions.closeNotification())}
        severity={notification.type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};
