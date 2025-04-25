import { useState } from "react";
import SettingsSidebar from "../components/SettingsSidebar";
import ProfileSettings from "./ProfileSettings";
import Sidebar from "../components/sibebar";
import AuthHeader from "../components/AuthHeader";

export default function Settings() {
  const [section, setSection] = useState("profile");

  const renderSection = () => {
    switch (section) {
      case "profile":
        return <ProfileSettings />;
      default:
        return <div className="text-white">Coming soon...</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AuthHeader />

      <div className="flex flex-1">
        {/* Main App Sidebar */}
        <Sidebar />

        {/* Gradient BG Wrapper */}
        <div className="flex-1 p-8 min-h-screen">
          {/* Centered Settings Panel */}
          <div className="bg-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden max-w-6xl mx-auto min-h-[600px]">
            {/* Settings Sidebar Panel */}
            <div className="w-full md:w-64 p-6">
              <SettingsSidebar currentSection={section} setSection={setSection} />
            </div>

            {/* Settings Section Content */}
            <div className="flex-1 p-6 text-white">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  