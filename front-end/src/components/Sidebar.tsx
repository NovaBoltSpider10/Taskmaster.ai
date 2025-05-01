import { Link, useLocation, useNavigate } from "react-router-dom";
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
import ThemeLogo from './ThemeLogo';

interface NavItem {
  name: string;
  path: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt },
  { name: "Calendar",  path: "/calendar",  icon: FaCalendarAlt },
  { name: "Friends",   path: "/friends",   icon: FaUserFriends },
  { name: "Class Manager", path: "/classes", icon: FaChalkboardTeacher },
  { name: "Tasks",     path: "/tasks",     icon: FaTasks },
  { name: "FlashCards",path: "/flashcards",icon: SiFuturelearn },
  { name: "Resources", path: "/resources", icon: GrResources },
  { name: "Settings",  path: "/settings",  icon: FaCog },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-56 h-screen fixed top-0 left-0 bg-secondary shadow-xl flex flex-col justify-between z-20 transition-colors duration-300 font-sans">
      {/* Top Section */}
      <div className="px-5 pt-8 pb-6">
        <Link to="/" className="flex items-center gap-3 mb-10 px-1">
          <ThemeLogo width={40} height={40} />
          <span className="text-lg font-bold text-foreground tracking-wide">
            TaskMasterAI
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-base font-medium
                ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon size={18} className="min-w-[18px] opacity-70" />
                <span className="flex-1 truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="p-5 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-base font-semibold text-destructive-foreground bg-destructive hover:opacity-90 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-secondary shadow-sm"
        >
          <FaSignOutAlt size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
