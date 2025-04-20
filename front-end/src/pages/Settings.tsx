import { useEffect, useState } from "react";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const enabled = html.classList.toggle("dark");
    localStorage.setItem("theme", enabled ? "dark" : "light");
    setIsDarkMode(enabled);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-skyLightest via-white to-skyLightest dark:from-[#181825] dark:via-[#1e1e2e] dark:to-[#181825] text-gray-800 dark:text-darkText transition px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-darkCard rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Change Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-darkAccent text-black dark:text-white shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Change Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-darkAccent text-black dark:text-white shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-darkCard rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Theme</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-md text-white text-sm font-semibold transition 
                ${isDarkMode ? "bg-violet-600 hover:bg-violet-700" : "bg-gray-400 hover:bg-gray-500"}
              `}
            >
              {isDarkMode ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-darkCard rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Dashboard Display Options</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-darkAccent text-black dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>Show All</option>
                <option>Show Only Important</option>
                <option>Hide Notifications</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-darkCard rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Privacy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Privacy Preferences</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-darkAccent text-black dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>Public</option>
                <option>Friends Only</option>
                <option>Private</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
