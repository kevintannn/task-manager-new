import { Link, useLocation } from "react-router-dom";

/* eslint-disable react/prop-types */
const ListLayout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div className="mx-10 mt-5 flex flex-col gap-10 pb-10">
      <div className="flex items-center gap-3">
        <Link
          className={`${pathname === "/tasks" ? "bg-blue-200" : "bg-blue-100"} flex w-40 items-center justify-center rounded-lg p-2 hover:bg-blue-200`}
        >
          Tasks
        </Link>

        <Link
          className={`${pathname === "/projects" ? "bg-blue-200" : "bg-blue-100"} flex w-40 items-center justify-center rounded-lg p-2 hover:bg-blue-200`}
        >
          Projects
        </Link>
      </div>

      {children}
    </div>
  );
};

export default ListLayout;
