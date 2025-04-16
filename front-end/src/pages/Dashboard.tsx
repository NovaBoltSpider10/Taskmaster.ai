import Sidebar from "../components/sibebar";
import { motion } from "framer-motion";

function Dashboard() {
  // Dummy data
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

  const currentTime = () => {
    let greeting: string = "";

    const now = new Date();
    const hours = now.getHours();

    if (hours >= 12 && hours < 18) {
      //Between 12pm to 6pm
      greeting = "Good Afternoon";
    } else if (hours >= 18 && hours < 22) {
      greeting = "Good Evening"; //From 6pm to 12am
    } else if ((hours >= 22 && hours <= 23) || (hours >= 0 && hours < 5)) {
      greeting = "Good Morning"; //From 10pm to 5am
    } else {
      greeting = "Good Morning"; // From 5am to 12pm
    }
    console.log(hours);

    return greeting;
  };

  return (
    <div className="relative flex">
      <Sidebar />

      {/* Animate Gradien. Bg */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-900 via-blue-700 via-indigo-600 via-cyan-500 via-blue-600 to-blue-900"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 4, // Faster animation
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut", // Smoother transition
        }}
        style={{
          backgroundSize: "400% 400%", // Larger size for more vibrant effect
        }}
      ></motion.div>

      <div className="flex-1 p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-white">{currentTime()}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            <div>
              <p>
                <strong>Name:</strong> {userProfile.name}
              </p>
              <p>
                <strong>Email:</strong> {userProfile.email}
              </p>
            </div>
          </motion.div>

          {/* Tasks Card */}
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between h-[300px]"
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

          {/* Friends Card */}
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            <ul className="space-y-2">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className="bg-gray-100 p-3 rounded-lg text-gray-700"
                >
                  {friend.name}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
