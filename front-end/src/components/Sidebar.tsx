import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaChalkboardTeacher,
  FaCog,
  FaTasks,
  FaSignOutAlt, // Added logout icon
} from "react-icons/fa";
import { SiFuturelearn } from "react-icons/si";
import { GrResources } from "react-icons/gr";
import type { IconType } from "react-icons";

interface NavItem {
  name: string;
  path: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt },
  { name: "Calendar", path: "/calendar", icon: FaCalendarAlt },
  { name: "Friends", path: "/friends", icon: FaUserFriends },
  { name: "Class Manager", path: "/classes", icon: FaChalkboardTeacher },
  { name: "Tasks", path: "/tasks", icon: FaTasks },
  { name: "FlashCards", path: "/flashcards", icon: SiFuturelearn },
  { name: "Resources", path: "/resources", icon: GrResources },
  { name: "Settings", path: "/settings", icon: FaCog },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-[#0A1F44]">
      {/* Top: Logo + Nav */}
      <div>
        {/* Brand */}
        <div className="flex items-center px-6 py-5">
          {/* Replace src with your real logo */}
          <img
            className="mr-4 cursor-pointer"
            onClick={() => navigate("")}
            src="school_work_1.svg"
            alt="Logo"
            width={30}
            height={30}
          />
          <span
            className="text-white text-xl font-bold cursor-pointer"
            onClick={() => navigate("")}
          >
            TaskMaster.ai
          </span>
        </div>

        {/* Nav Links */}
        <nav className="mt-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center px-6 py-3 mx-1 mb-1 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-[#300dc9] text-white"
                      : "text-gray-300 hover:bg-[#152648] hover:text-white"
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Logout Button */}
      <div className="px-6 py-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-[#152648] hover:text-white rounded-lg transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}