import { useState } from "react";

const sections = [
  { label: "Profile", key: "profile" },
  { label: "Notifications", key: "notifications" },
  { label: "Privacy", key: "privacy" },
];

interface SidebarProps {
  currentSection: string;
  setSection: (key: string) => void;
}

export default function SettingsSidebar({ currentSection, setSection }: SidebarProps) {
  return (
    <div className="w-full md:w-64 bg-gray-800 text-white h-full p-4 space-y-2">
      <h2 className="text-lg font-bold mb-4">User Settings</h2>
      {sections.map((section) => (
        <button
          key={section.key}
          onClick={() => setSection(section.key)}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            currentSection === section.key
              ? "bg-gray-700 text-white font-semibold"
              : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}
