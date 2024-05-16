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
import ProjectList from "./screens/ProjectList.jsx";
import CreateProject from "./screens/CreateProject.jsx";
import ViewProject from "./screens/ViewProject.jsx";
import EditProject from "./screens/EditProject.jsx";
import Completion from "./screens/Completion.jsx";
import Auth from "./screens/Auth.jsx";
import Register from "./screens/Register.jsx";
import EditProfile from "./screens/EditProfile.jsx";

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
        path: "projects",
        element: <ProjectList />,
      },
      {
        path: "/projects/:id",
        element: <ViewProject />,
      },
      {
        path: "/projects/:id/edit",
        element: <EditProject />,
      },
      {
        path: "/projects/create",
        element: <CreateProject />,
      },
      {
        path: "/completion",
        element: <Completion />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/login",
        element: <Auth />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "*",
        element: <Dashboard />,
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
