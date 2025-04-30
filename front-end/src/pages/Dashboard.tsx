import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

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
      className={`cursor-pointer bg-card text-card-foreground rounded-2xl shadow-lg hover:shadow-xl p-6 transition duration-300 ${className}`}
    >
      <h2 className="text-xl font-bold mb-3 text-emphasis">{title}</h2>
      <div className="space-y-2 text-muted-foreground text-sm">{children}</div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full text-gray-900 dark:text-white px-6 py-10 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-6 pb-10">
        <Card title="User Profile" link="/profile" className="md:col-span-2">
          {user ? (
            <div className="bg-muted text-muted-foreground p-3 rounded-lg flex items-center space-x-3">
              {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-lg font-semibold">
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
              )}
              <div>
                  <p className="font-medium text-foreground">{user.username || 'Username'}</p>
                  <p className="text-xs">{user.email || 'email@example.com'}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Could not load user data.</p>
          )}
        </Card>

        <Card title="Friends" link="/friends" className="md:col-span-2">
          <div className="space-y-1">
            <p className="text-foreground">👩 Alice Johnson</p>
            <p className="text-foreground">👨 Bob Smith</p>
            <p className="text-foreground">🧑 Charlie Brown</p>
          </div>
        </Card>

        <Card title="Resources" link="/resources" className="md:col-span-2">
          <div className="grid gap-1">
            <p className="text-foreground">📄 Lecture Notes</p>
            <p className="text-foreground">📘 Study Guides</p>
            <p className="text-foreground">🔗 Useful Links</p>
          </div>
        </Card>

        <Card title="Classes" link="/classes" className="md:col-span-4">
          <div className="flex flex-wrap gap-3">
            {["Math 101", "Biology 202", "History 150"].map((cls) => (
              <span
                key={cls}
                className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold"
              >
                {cls}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Calendar" link="/calendar" className="md:col-span-2">
          <div className="bg-secondary text-secondary-foreground p-3 rounded-md">
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
                className="bg-muted text-muted-foreground p-3 rounded-md shadow-sm"
              >
                <span className="text-foreground font-medium">{task.title}</span>
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
