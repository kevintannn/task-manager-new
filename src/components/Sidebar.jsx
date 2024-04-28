import { Link, useLocation } from "react-router-dom";
import MyLogo from "./MyLogo";
import DashboardIcon from "@mui/icons-material/Dashboard";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import StorageIcon from "@mui/icons-material/Storage";
import PieChartIcon from "@mui/icons-material/PieChart";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";

const sidebarLinks = [
  { icon: <DashboardIcon />, link: "/" },
  { icon: <PeopleIcon />, link: "/people" },
  { icon: <StorageIcon />, link: null },
  { icon: <PieChartIcon />, link: null },
  { icon: <ChatBubbleIcon />, link: null },
  { icon: <SettingsIcon />, link: "/profile" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

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
              className={`${pathname === item.link ? "shadow-md" : "bg-blue-100/80"} flex h-fit w-fit items-center justify-center rounded-lg p-3 duration-150 hover:bg-white hover:shadow-md`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* bolt link */}
      <Link className="flex h-fit w-fit items-center justify-center rounded-lg bg-purple-900 p-3">
        <OfflineBoltIcon
          sx={{
            color: "white",
          }}
        />
      </Link>
    </div>
  );
};

export default Sidebar;
