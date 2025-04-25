import { useState } from "react";
import {Home,User,LogOut,Users,BookOpen,Menu,Calendar1,X,Settings,} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="relative">
      {/* Mobile top navigation bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 h-16 flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-bold text-white">Taskmaster.ai</h1>
        <button className="p-2 text-white rounded-md" onClick={toggleSidebar}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Content wrapper */}
      <div className="md:ml-64 min-h-screen pt-16 md:pt-0" />

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out
        fixed top-0 left-0 z-40
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        md:translate-x-0 md:shadow-lg
        flex flex-col
        w-64 md:w-64
        pt-16 md:pt-0`}
      >
        {/* Logo (Desktop only) */}
        <div className="hidden md:flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className="text-xl font-bold">Taskmaster.AI</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 group transition-all duration-200 w-full text-left"
              >
                <Home className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 group transition-all duration-200 w-full text-left"
              >
                <User className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/friends")}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 group transition-all duration-200 w-full text-left"
              >
                <Users className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
                <span>Friends</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/syllabus")}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 group transition-all duration-200 w-full text-left"
              >
                <BookOpen className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
                <span>Syllabus</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/calendar")}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 group transition-all duration-200 w-full text-left"
              >
                <Calendar1 className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
                <span>Calendar</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 group transition-all duration-200 w-full text-left"
              >
                <Settings className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 group transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
