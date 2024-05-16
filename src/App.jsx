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
import { divisions, projects, tasks, users } from "./data";

const App = () => {
  const { pathname } = useLocation();

  const auth = useSelector((state) => state.auth);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getTasks());
    dispatch(getProjects());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const existingDivisionsJSON = localStorage.getItem("divisions");
    const existingUsersJSON = localStorage.getItem("users");
    const existingTasksJSON = localStorage.getItem("tasks");
    const existingProjectsJSON = localStorage.getItem("projects");

    if (!existingDivisionsJSON) {
      localStorage.setItem("divisions", JSON.stringify(divisions));
    }

    if (!existingUsersJSON) {
      localStorage.setItem("users", JSON.stringify(users));
    }

    if (!existingTasksJSON) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    if (!existingProjectsJSON) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, []);

  return (
    !loading && (
      <>
        <Notification notification={notification} />

        {!auth.user.id && <Navigate to="/login" />}
        {!auth.user.id && pathname === "/register" && (
          <Navigate to="/register" />
        )}

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
    )
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
