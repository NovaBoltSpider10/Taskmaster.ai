import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaChalkboardTeacher,
  FaCog,
  FaTasks,
  FaSignOutAlt,
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

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
    <div className="w-56 h-screen fixed top-0 left-0 bg-white dark:bg-darkCard shadow-xl flex flex-col justify-between z-20 font-roboto font-medium text-base transition-colors">
      {/* Top Section */}
      <div className="px-3 pt-4 pb-2">
        <Link to="/" className="flex items-center gap-2 mb-6 px-1">
          <img src="/school_work_1.svg" alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-extrabold text-violet-800 dark:text-lavenderAccent tracking-tight">
            TaskMasterAI
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-2.5 py-2 rounded-md transition w-full
                ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                    : "text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon size={16} className="min-w-[16px]" />
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;