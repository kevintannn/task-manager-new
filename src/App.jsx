/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./screens/Auth";
import { useEffect, useState } from "react";
import { getUser } from "./store/authActions";
import { getTasks } from "./store/taskActions";
import { Alert, Snackbar } from "@mui/material";
import { uiActions } from "./store/uiSlice";

const App = () => {
  const auth = useSelector((state) => state.auth);
  const notification = useSelector((state) => state.ui.notification);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getTasks());
    setLoading(false);
  }, [dispatch]);

  return (
    !loading && (
      <>
        <Notification notification={notification} />

        {!auth.user.id && <Auth />}

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
