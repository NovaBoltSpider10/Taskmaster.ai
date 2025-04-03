import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaChalkboardTeacher,
  FaCog,
} from "react-icons/fa";
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
    { name: "Settings", path: "/settings", icon: FaCog },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-md p-4">
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
