import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./screens/Auth";
import { useEffect, useState } from "react";
import { getUser } from "./store/authActions";

const App = () => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getUser());
    setLoading(false);
  }, [dispatch]);

  return (
    !loading && (
      <>
        {!auth.id && <Auth />}

        {auth.id && (
          <div className="flex">
            <Sidebar />

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
