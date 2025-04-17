import { useState } from "react";

export default function ProfileSettings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [studyMode, setStudyMode] = useState("");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Profile Setup</h2>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-w-2xl">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Display Name */}
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Johnny"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quiz Form */}
      <form className="space-y-6 max-w-2xl">
        {/* Q1 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Are you introverted or extroverted?
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="personality" value="introverted" className="form-radio text-blue-500" />
              <span className="text-white">Introverted</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="personality" value="extroverted" className="form-radio text-blue-500" />
              <span className="text-white">Extroverted</span>
            </label>
          </div>
        </div>

        {/* Q2 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            When do you prefer to study?
          </label>
          <select className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Morning (before 12pm)</option>
            <option>Afternoon (before 4pm)</option>
            <option>Evening (before 8pm)</option>
            <option>Night (after 8pm)</option>
          </select>
        </div>

        {/* Q3 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Do you prefer to study in person or virtual?
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="studyMode"
                value="inPerson"
                className="form-radio text-blue-500"
                onChange={() => setStudyMode("inPerson")}
              />
              <span className="text-white">In Person</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="studyMode"
                value="virtual"
                className="form-radio text-blue-500"
                onChange={() => setStudyMode("virtual")}
              />
              <span className="text-white">Virtual</span>
            </label>
          </div>
        </div>

        {/* Q4 */}
        {studyMode === "inPerson" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              If in person, do you prefer public or private spaces?
            </label>
            <select className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Public Spaces</option>
              <option>Private Spaces</option>
            </select>
          </div>
        )}
      </form>
    </div>
  );
}
