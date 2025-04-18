import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaChalkboardTeacher,
  FaCog,
  FaTasks,
} from "react-icons/fa";
import { SiFuturelearn } from "react-icons/si";
import { GrResources } from "react-icons/gr";
import type { IconType } from "react-icons";

interface NavItem {
  name: string;
  path: string;
  icon: IconType;
}

function Sidebar() {
  const location = useLocation();

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

  return (
    <div className="w-64 h-screen bg-white shadow-md p-4">
      {/* Logo Section */}
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/school_work_1.svg" // Replace with your logo path
            alt="Logo"
            className="w-10 h-10"
          />
          <span className="text-xl font-bold text-gray-800">Taskmaster AI</span>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition ${
                location.pathname === item.path
                  ? "bg-blue-200 font-semibold"
                  : ""
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;