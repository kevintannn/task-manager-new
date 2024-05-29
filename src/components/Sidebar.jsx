import GitHubLogo from "../assets/github.png";
import { Link, useLocation } from "react-router-dom";
import MyLogo from "./MyLogo";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import PieChartIcon from "@mui/icons-material/PieChart";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";

const sidebarLinks = [
  { icon: <DashboardIcon />, link: "/" },
  { icon: <PeopleIcon />, link: "/people" },
  { icon: <StorageIcon />, link: "/tasks" },
  { icon: <PieChartIcon />, link: "/completion" },
  { icon: <ChatBubbleIcon />, link: "/forum" },
  { icon: <SettingsIcon />, link: "/profile" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  const correctPathname = (link) => {
    if (link === "/tasks" && pathname === "/projects") {
      return true;
    }

    if (pathname === link) {
      return true;
    }

    return false;
  };

  return (
    <div className="fixed flex h-screen flex-col items-center justify-between p-5">
      {/* logo and sidebar links */}
      <div className="flex flex-col items-center justify-center gap-10">
        {/* logo */}
        <Link to={"/"}>
          <MyLogo />
        </Link>

        {/* sidebar links */}
        <div className="flex flex-col items-center justify-center gap-5">
          {sidebarLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`${correctPathname(item.link) ? "shadow-md" : "bg-blue-50"} flex h-fit w-fit items-center justify-center rounded-lg p-3 duration-150 hover:bg-white hover:shadow-md`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* bolt link */}
      <a
        href="https://github.com/kevintannn/task-manager-new"
        target="_blank"
        className="flex h-fit w-fit items-center justify-center rounded-lg bg-purple-900 p-3"
      >
        <img
          src={GitHubLogo}
          className="h-6 w-6 object-cover"
          style={{
            filter: "invert(100%)",
          }}
        />
      </a>
    </div>
  );
};

export default Sidebar;
