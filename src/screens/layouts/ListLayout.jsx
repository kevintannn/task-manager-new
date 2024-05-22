import { Link, useLocation } from "react-router-dom";

/* eslint-disable react/prop-types */
const ListLayout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div className="mx-10 mt-5 flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-3">
        <Link
          to="/tasks"
          className={`${pathname.startsWith("/tasks") ? "bg-blue-100" : "bg-blue-50 transition-all duration-150 hover:bg-blue-100"} flex w-40 items-center justify-center rounded-lg p-2`}
        >
          Tasks
        </Link>

        <Link
          to="/projects"
          className={`${pathname.startsWith("/projects") ? "bg-blue-100" : "bg-blue-50 transition-all duration-150 hover:bg-blue-100"} flex w-40 items-center justify-center rounded-lg p-2`}
        >
          Projects
        </Link>
      </div>

      {children}
    </div>
  );
};

export default ListLayout;
