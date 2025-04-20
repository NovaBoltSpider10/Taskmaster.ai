import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  const fadeVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } },
  };

  const Card = ({
    title,
    link,
    children,
    className = "",
  }: {
    title: string;
    link: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <motion.div
      variants={fadeVariant}
      initial="hidden"
      animate="visible"
      onClick={() => navigate(link)}
      className={`cursor-pointer bg-white dark:bg-darkCard text-gray-800 dark:text-darkText rounded-2xl shadow-lg hover:shadow-xl p-6 transition duration-300 ${className}`}
    >
      <h2 className="text-xl font-bold mb-3 text-purple-700 dark:text-lavenderAccent">{title}</h2>
      <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full p-6 flex justify-center bg-gradient-to-br from-skyLightest via-white to-skyLightest dark:from-[#181825] dark:via-[#1e1e2e] dark:to-[#181825] text-gray-900 dark:text-darkText transition">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-6 gap-6 pb-10">
        <Card title="User Profile" link="/settings" className="md:col-span-2">
          <div className="bg-violet-50 dark:bg-darkAccent p-3 rounded-lg">
            <p className="font-medium">John Doe</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">johndoe@example.com</p>
          </div>
        </Card>

        <Card title="Friends" link="/friends" className="md:col-span-2">
          <div className="space-y-1">
            <p>👩 Alice Johnson</p>
            <p>👨 Bob Smith</p>
            <p>🧑 Charlie Brown</p>
          </div>
        </Card>

        <Card title="Resources" link="/resources" className="md:col-span-2">
          <div className="grid gap-1">
            <p>📄 Lecture Notes</p>
            <p>📘 Study Guides</p>
            <p>🔗 Useful Links</p>
          </div>
        </Card>

        <Card title="Classes" link="/classes" className="md:col-span-4">
          <div className="flex flex-wrap gap-3">
            {["Math 101", "Biology 202", "History 150"].map((cls) => (
              <span
                key={cls}
                className="bg-purple-100 dark:bg-lavenderSecondary text-purple-700 dark:text-white px-3 py-1 rounded-full text-xs font-semibold"
              >
                {cls}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Calendar" link="/calendar" className="md:col-span-2">
          <div className="bg-blue-50 dark:bg-darkAccent text-blue-800 dark:text-white p-3 rounded-md">
            <p>📅 Math HW due Apr 25, 11:59 PM</p>
          </div>
        </Card>

        <Card title="Tasks" link="/tasks" className="md:col-span-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "🧠 Math HW", due: "April 25" },
              { title: "🎤 Science Presentation", due: "April 28" },
              { title: "📝 History Essay", due: "May 2" },
            ].map((task, i) => (
              <div
                key={i}
                className="bg-pink-100 dark:bg-lavenderPink text-pink-800 dark:text-white p-3 rounded-md shadow-sm"
              >
                {task.title}
                <br />
                <span className="text-xs">Due: {task.due}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
