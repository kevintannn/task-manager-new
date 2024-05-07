import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./screens/Error.jsx";
import store from "./store/index.jsx";
import { Provider } from "react-redux";
import Dashboard from "./screens/Dashboard.jsx";
import Profile from "./screens/Profile.jsx";
import CreateTask from "./screens/CreateTask.jsx";
import ViewTask from "./screens/ViewTask.jsx";
import EditTask from "./screens/EditTask.jsx";
import People from "./screens/People.jsx";
import TaskList from "./screens/TaskList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "people",
        element: <People />,
      },
      {
        path: "tasks",
        element: <TaskList />,
      },
      {
        path: "/tasks/create",
        element: <CreateTask />,
      },
      {
        path: "/tasks/:id",
        element: <ViewTask />,
      },
      {
        path: "/tasks/:id/edit",
        element: <EditTask />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
