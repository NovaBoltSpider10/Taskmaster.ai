import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react"; // Added imports
import axios from "axios"; // Added import

// --- Interfaces (Define data structures) ---
interface UserData {
  _id: string;
  name?: string; // Use name if available, fallback needed
  firstName?: string; // Or use firstName/lastName
  lastName?: string;
  username?: string; // Keep username if available
  email?: string;
  profileImageUrl?: string; // Keep for potential future use
}

interface ClassData {
  _id: string;
  name: string;
  location?: string; // Keep location if needed later
  // Add other fields if needed by other logic
}

interface ResourceData {
  _id: string;
  urls: string[];
  class: string; // classId
}

interface TasksData {
  _id: string;
  deadline: string;
  topic: string;
  title: string;
  status: "pending" | "completed" | "overdue";
  className?: string; // Added during fetch
}


const Dashboard = () => {
  const navigate = useNavigate();

  // --- State Variables ---
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userClasses, setUserClasses] = useState<ClassData[]>([]);
  const [dashboardResources, setDashboardResources] = useState<string[]>([]);
  const [dashboardTasks, setDashboardTasks] = useState<TasksData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  // --- Fetching Logic ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch User Data
        const userRes = await axios.get<UserData>(
          "http://localhost:5000/user/me",
          { headers: { "x-auth-token": token } }
        );
        setUserData(userRes.data);
        const userId = userRes.data._id;

        // 2. Fetch Classes
        const classesRes = await axios.get<ClassData[]>(
          `http://localhost:5000/class/user/${userId}`,
          { headers: { "x-auth-token": token } }
        );
        setUserClasses(classesRes.data);

        // 3. Fetch Resources & Tasks in Parallel (only if classes exist)
        if (classesRes.data.length > 0) {
          const classIds = classesRes.data.map(c => c._id);

          const resourcePromises = classIds.map(id =>
            axios.get<ResourceData[]>(`http://localhost:5000/resources/class/${id}`, { headers: { "x-auth-token": token } })
              .then(res => res.data.flatMap(r => r.urls)) // Extract URLs directly
              .catch(err => {
                console.warn(`Failed fetching resources for class ${id}:`, err.message);
                return []; // Return empty array on error
              })
          );

          const taskPromises = classesRes.data.map(c => // Use full class data here
            axios.get<TasksData[]>(`http://localhost:5000/tasks/classid/${c._id}`, { headers: { "x-auth-token": token } })
              .then(res => res.data.map(t => ({ ...t, className: c.name }))) // Add class name
              .catch(err => {
                console.warn(`Failed fetching tasks for class ${c._id}:`, err.message);
                return []; // Return empty array on error
              })
          );

          const [resourceUrlsArrays, taskArrays] = await Promise.all([
              Promise.all(resourcePromises),
              Promise.all(taskPromises)
          ]);

          // Process Resources: Flatten and take first 3 URLs
          const allResourceUrls = resourceUrlsArrays.flat();
          setDashboardResources(allResourceUrls.slice(0, 3));

          // Process Tasks: Flatten, filter pending/overdue, sort by deadline, take first 3
          const allTasks = taskArrays.flat();
          const relevantTasks = allTasks
            .filter(task => task.status === 'pending' || task.status === 'overdue') // Filter for relevant tasks
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()); // Sort by deadline
          setDashboardTasks(relevantTasks.slice(0, 3));

        } else {
            // No classes, so no resources or tasks to fetch
            setDashboardResources([]);
            setDashboardTasks([]);
        }

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        const message = err.response?.data?.message || err.message || "Failed to load dashboard data.";
        setError(message);
        // Clear potentially partial data
        setUserData(null);
        setUserClasses([]);
        setDashboardResources([]);
        setDashboardTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);


  // --- Framer Motion Variants (Keep Original) ---
  const fadeVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } },
  };

  // --- Reusable Card Component (Keep Original Styling, adjust theme names if needed) ---
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
      // Original styling from the target snippet
      className={`cursor-pointer bg-white/90 dark:bg-[#2a2633] text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg hover:shadow-xl p-6 transition duration-300 ${className}`}
    >
       {/* Original styling */}
      <h2 className="text-xl font-bold mb-3 text-purple-700 dark:text-lavenderAccent">{title}</h2>
      {/* Original styling */}
      <div className="space-y-2 text-gray-800 dark:text-gray-300 text-sm">{children}</div>
    </motion.div>
  );

  // --- Helper to format resource URL ---
  const formatResourceUrl = (url: string): string => {
      try {
          const urlParts = url.split('/');
          const filename = urlParts.pop(); // Get last part
          // Decode URI component and limit length
          return decodeURIComponent(filename || url).substring(0, 50) + ( (filename || url).length > 50 ? "..." : "");
      } catch (e) {
          return url.substring(0, 50) + (url.length > 50 ? "..." : ""); // Fallback
      }
  }

   // --- Loading State ---
   if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Use a theme-consistent spinner */}
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-300 dark:border-lavenderAccent border-t-transparent"></div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
        <div className="flex items-center justify-center h-screen text-center text-red-500 dark:text-red-400 p-6">
            Error: {error}
        </div>
    );
  }


  // --- Main Render ---
  return (
    // Original outer div styling
    <div className="relative min-h-screen w-full text-gray-900 dark:text-white px-6 py-10 overflow-hidden">
       {/* Optional: Add background component if used */}
       {/* <AnimatedBackground /> */}

      {/* Original Grid Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-6 pb-10">

        {/* User Profile Card - Updated with fetched data */}
        <Card title="User Profile" link="/profile" className="md:col-span-2">
           {/* Original inner styling */}
          <div className="bg-violet-50 dark:bg-[#3a314c] p-3 rounded-lg">
             {/* Use fetched user data */}
            <p className="font-medium">{userData?.name || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || userData?.username || 'Username'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{userData?.email || 'email@example.com'}</p>
          </div>
        </Card>

        {/* Friends Card - Kept Hardcoded */}
        <Card title="Friends" link="/friends" className="md:col-span-2">
          <div className="space-y-1">
            <p>👩 Alice Johnson</p>
            <p>👨 Bob Smith</p>
            <p>🧑 Charlie Brown</p>
          </div>
        </Card>

        {/* Resources Card - Updated with fetched data */}
        <Card title="Resources" link="/resources" className="md:col-span-2">
          <div className="grid gap-1">
             {dashboardResources.length > 0 ? (
                dashboardResources.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-lavenderAccent truncate"
                    title={url} // Show full URL on hover
                  >
                      {/* Link Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                      <span className="truncate">{formatResourceUrl(url)}</span>
                  </a>
                ))
             ) : (
                <p className="text-gray-400 dark:text-gray-500">No recent resources found.</p>
             )}
          </div>
        </Card>

        {/* Classes Card - Updated with fetched data */}
        <Card title="Classes" link="/classes" className="md:col-span-4">
          <div className="flex flex-wrap gap-2"> {/* Adjusted gap */}
            {userClasses.length > 0 ? (
                userClasses.slice(0, 8).map((cls) => ( // Show limited number on dashboard
                <span
                    key={cls._id}
                     // Original styling
                    className="bg-purple-100 dark:bg-[#5b4e71] text-purple-700 dark:text-white px-3 py-1 rounded-full text-xs font-semibold"
                >
                    {cls.name}
                </span>
                ))
            ) : (
                 <p className="text-gray-400 dark:text-gray-500">No classes found.</p>
            )}
             {userClasses.length > 8 && (
                 <span className="text-xs text-gray-500 dark:text-gray-400 self-center">...and more</span>
             )}
          </div>
        </Card>

        {/* Calendar Card - Kept Hardcoded */}
        <Card title="Calendar" link="/calendar" className="md:col-span-2">
           {/* Original styling */}
          <div className="bg-blue-50 dark:bg-[#3a4b6b] text-blue-800 dark:text-white p-3 rounded-md">
             {/* Updated placeholder date */}
            <p>📅 Bio Quiz due May 2, 11:59 PM</p>
          </div>
        </Card>

        {/* Tasks Card - Updated with fetched data */}
        <Card title="Tasks" link="/tasks" className="md:col-span-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dashboardTasks.length > 0 ? (
                dashboardTasks.map((task) => (
                <div
                    key={task._id}
                     // Original styling
                    className="bg-pink-100 dark:bg-[#5a3d4c] text-pink-800 dark:text-white p-3 rounded-md shadow-sm"
                >
                    <span className="font-medium">{task.title}</span> ({task.className})
                    <br />
                    <span className="text-xs">
                       Due: {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                ))
             ) : (
                 <p className="text-gray-400 dark:text-gray-500 sm:col-span-3 text-center py-4">No upcoming tasks found.</p>
             )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
