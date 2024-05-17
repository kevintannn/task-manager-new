/* eslint-disable react/prop-types */
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const TopBar = ({ search, setSearch, mode = "default" }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div
      className={`${mode === "only_profile" ? "justify-end" : "justify-between"} flex items-center text-sm`}
    >
      {/* search box */}
      {mode !== "only_profile" && (
        <div className="relative flex items-center">
          <SearchIcon
            className="absolute ml-3"
            sx={{
              color: "gray",
            }}
          />

          <input
            className="w-96 rounded-md bg-blue-50 p-2 pl-10 outline-none"
            placeholder="Search for task or project"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* notification bell and profile */}
      <div className="flex items-center gap-5">
        {/* notification bell */}
        <div className="cursor-pointer duration-150 hover:scale-125">
          <NotificationsIcon sx={{ color: "gray" }} />
        </div>

        {/* profile */}
        <Link
          to={"/profile"}
          className="group flex h-12 cursor-pointer items-center justify-center gap-3 bg-gray-50 "
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            {user.imgPath ? (
              <img
                src={user.imgPath}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <AccountCircleIcon />
            )}
          </div>

          <div className="mr-5 duration-150 group-hover:ml-3 group-hover:mr-7">
            <p>{user.name}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>

          <div className="flex h-full w-3 items-center justify-center rounded-[3px] bg-blue-900">
            <MoreVertIcon
              sx={{
                color: "white",
              }}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
