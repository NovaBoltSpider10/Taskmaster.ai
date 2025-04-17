import Sidebar from "../components/sibebar";
import AuthHeader from "../components/AuthHeader";
import { motion } from "framer-motion";

function Dashboard() {
  const userProfile = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  const tasks = [
    { id: 1, title: "Complete project report", status: "In Progress" },
    { id: 2, title: "Plan team meeting", status: "Pending" },
    { id: 3, title: "Review pull requests", status: "Completed" },
    { id: 4, title: "Review pull requests", status: "Completed" },
    { id: 5, title: "Review pull requests", status: "Completed" },
    { id: 6, title: "Review pull requests", status: "Completed" },
    { id: 7, title: "Review pull requests", status: "Completed" },
  ];

  const friends = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AuthHeader />

      <div className="flex flex-1">
        <Sidebar />

        {/* Animate Gradient BG */}
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-900 via-blue-700 via-indigo-600 via-cyan-500 via-blue-600 to-blue-900"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          style={{ backgroundSize: "400% 400%" }}
        />

        <div className="flex-1 p-6 min-h-screen text-white">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Profile */}
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">User Profile</h2>
              <p><strong>Name:</strong> {userProfile.name}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
            </motion.div>

            {/* Tasks */}
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between h-[300px] text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Tasks</h2>
              <ul className="space-y-2 overflow-auto">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                  >
                    <span>{task.title}</span>
                    <span
                      className={`text-sm font-medium ${
                        task.status === "Completed"
                          ? "text-green-600"
                          : task.status === "In Progress"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Friends */}
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Friends</h2>
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li
                    key={friend.id}
                    className="bg-gray-100 p-3 rounded-lg"
                  >
                    {friend.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
