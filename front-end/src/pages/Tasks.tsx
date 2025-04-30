import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
// Assuming tasksStore provides a zustand store or similar
import { setTasks as setTasksStore } from "../components/tasksStore";

// Interfaces remain the same from the first snippet
export interface TasksData {
  _id: string;
  deadline: string;
  topic: string;
  title: string;
  status: "pending" | "completed" | "overdue";
  points: number | null;
  textbook: string | null;
  class: string; // classId
  className?: string; // Added by fetching logic
  classLocation?: string; // Added by fetching logic
}

export interface ClassData {
  _id: string;
  name: string;
  professor: string;
  timing: string;
  examDates: string[];
  topics: string[];
  gradingPolicy: string;
  contactInfo: string;
  textbooks: string[];
  location: string;
  user: string;
}

// Interface for user data from /me endpoint
interface UserData {
  _id: string;
}


const Tasks = () => {
  // State variables remain the same from the first snippet
  const [tasks, setTasks] = useState<TasksData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TasksData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  // Add token from localStorage (as used in the second snippet)
  const token = localStorage.getItem("token");

  // useEffect updated with backend integration logic
  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // 1) Get user ID from /me endpoint
        const userRes = await axios.get<UserData>(
          "http://localhost:3000/user/me", // Use port 3000
          { headers: { "x-auth-token": token } }
        );
        const userId = userRes.data._id;

        // 2) Fetch classes for that user
        // Assume token needed here too
        const { data: classes } = await axios.get<ClassData[]>(
          `http://localhost:3000/class/user/${userId}`, // Use port 3000 and dynamic userId
          { headers: { "x-auth-token": token } }
        );

        if (classes.length === 0) {
            setTasks([]);
            setTasksStore([]); // Update store as well
            setLoading(false);
            return;
        }

        // 3) Fetch tasks for each class in parallel, tagging with className and location
        // Assume token needed for fetching tasks
        const taskRequests = classes.map(async (c) => {
            try {
                const { data: ts } = await axios.get<TasksData[]>(
                  `http://localhost:3000/tasks/classid/${c._id}`, // Use port 3000
                  { headers: { "x-auth-token": token } }
                );
                // Add className and classLocation from the class data
                return ts.map((t) => ({ ...t, className: c.name, classLocation: c.location }));
             } catch (taskErr: any) {
                 console.warn(`Failed to fetch tasks for class ${c.name} (${c._id}): ${taskErr.message}`);
                 return []; // Return empty array if tasks for a class fail
             }
        });

        const nestedTasks = await Promise.all(taskRequests);
        const tasksData = nestedTasks.flat(); // Flatten the array of arrays

        // 4) Auto-patch any overdue "pending" tasks
        const now = new Date();
        const patchCalls = tasksData
          .filter((t) => t.status === "pending" && new Date(t.deadline) < now)
          .map((t) => {
            // Assume token needed for patching tasks
             return axios.patch(
                `http://localhost:3000/tasks/${t._id}`, // Use port 3000
                { status: "overdue" },
                { headers: { "x-auth-token": token } }
             ).then(() => {
                 t.status = "overdue"; // Update status locally after successful patch
             }).catch(patchErr => {
                 console.error(`Failed to update task ${t._id} to overdue:`, patchErr);
                 // Decide if you want to proceed without patching or throw error
             });
          });

        // Wait for all patch calls to complete (or fail gracefully)
        await Promise.all(patchCalls);

        // Sort tasks by deadline (earliest first)
        const sortedTasks = tasksData.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

        setTasks(sortedTasks); // Set the potentially updated and sorted tasks
        setTasksStore(sortedTasks); // Update the tasks store

      } catch (err: unknown) {
        // Handle errors from user/class fetch or major issues
        let message = "An unexpected error occurred.";
         if (axios.isAxiosError(err)) {
           message = err.response?.data?.message || err.message || "Failed to load tasks.";
         } else if (err instanceof Error) {
             message = err.message;
         }
        setError(message);
        console.error("Error in fetchTaskData:", err);
        setTasks([]); // Clear tasks on major error
        setTasksStore([]); // Clear store as well
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
    // Depend on token - if token changes, refetch
  }, [token]);

  // updateTaskStatus function updated with backend endpoint and token
  const updateTaskStatus = async (
    taskId: string,
    newStatus: TasksData["status"]
  ) => {
      if (!token) {
          setError("Authentication required to update task status.");
          return; // Prevent update without token
      }
      try {
        // Use port 3000 and add token header
        await axios.patch(
            `http://localhost:3000/tasks/${taskId}`, // Use port 3000
            { status: newStatus },
            { headers: { "x-auth-token": token } }
        );
        // Update local state optimistically or after confirmation
        const updatedTasks = tasks.map((t) =>
          t._id === taskId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);
        setTasksStore(updatedTasks); // Update store
        setError(null); // Clear previous errors on success
    } catch (err: unknown) {
         let message = "An unexpected error occurred while updating task.";
         if (axios.isAxiosError(err)) {
           message = err.response?.data?.message || err.message || "Failed to update task.";
         } else if (err instanceof Error) {
             message = err.message;
         }
        setError(message);
        console.error(`Error updating task ${taskId}:`, err);
    }
  };

  // Handlers for modal buttons remain largely the same, using the updated updateTaskStatus
  const handleComplete = () => {
    if (!selectedTask) return;
    updateTaskStatus(selectedTask._id, "completed").then(() =>
      setSelectedTask(null) // Close modal after update (assuming success)
    );
  };

  const handlePending = () => {
    if (!selectedTask) return;
    const now = new Date();
    const due = new Date(selectedTask.deadline);
    // Determine if it should be pending or overdue
    const newStatus: TasksData["status"] = (selectedTask.status !== 'completed' && due < now) ? "overdue" : "pending";
    updateTaskStatus(selectedTask._id, newStatus).then(() =>
      setSelectedTask(null) // Close modal after update
    );
  };

  // Status label function remains the same
  const statusLabel = (status: TasksData["status"]) => {
    if (status === "completed") return "Completed";
    if (status === "overdue") return "Overdue";
    return "Pending";
  };

  // Filter logic remains the same
  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);


  // --- Original JSX Structure and Styling (Unaltered) ---

  // Loading state - Original Styling
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Original spinner */}
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );

  // Error state - Original Styling (shows critical load errors)
   if (error && tasks.length === 0 && !loading) // Show full page error only on critical initial load failure
    return <div className="text-center text-destructive p-6">{error}</div>;

  // Main component return - Original structure & styling
  return (
    <div className="relative min-h-screen w-full text-gray-900 dark:text-darkText transition">
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
         {/* Display non-critical errors */}
         {error && <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-md border border-destructive/30">{error}</div>}

        <div className="w-full space-y-6">
          {/* Header and Filter - Original Structure & Styling */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h1 className="text-2xl font-bold text-emphasis">Tasks</h1>
            <div className="flex items-center gap-3">
              <label htmlFor="filter" className="text-sm font-medium text-foreground whitespace-nowrap">
                Filter by Status:
              </label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 rounded-md border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                <option value="all">All ({tasks.length})</option>
                <option value="pending">Pending ({tasks.filter(t=>t.status === 'pending').length})</option>
                <option value="completed">Completed ({tasks.filter(t=>t.status === 'completed').length})</option>
                <option value="overdue">Overdue ({tasks.filter(t=>t.status === 'overdue').length})</option>
              </select>
            </div>
          </div>

          {/* Task Grid - Original Structure & Styling */}
          {filteredTasks.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">
              {tasks.length === 0 ? "No tasks found. Upload a syllabus to potentially add tasks." : "No tasks match the selected filter."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {filteredTasks.map((task, i) => {
                const due = new Date(task.deadline);
                // Determine border color based on status - Original Logic & Styling
                const statusBorderClass =
                  task.status === "completed"
                    ? "border-green-500 dark:border-green-400"
                    : task.status === "overdue"
                    ? "border-destructive dark:border-red-500"
                    : "border-primary dark:border-blue-400"; // Assuming primary maps to pending

                return (
                  // Card with motion - Original Styling & Animation
                  <motion.div
                    key={task._id}
                    layout // Added layout prop for smoother transitions if list changes
                    className={`bg-card text-card-foreground rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 cursor-pointer border-l-4 ${statusBorderClass}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} // Added exit animation
                    transition={{ duration: 0.3, delay: i * 0.05 }} // Adjusted delay
                    onClick={() => setSelectedTask(task)}
                  >
                    <h3 className="text-md font-medium text-foreground mb-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                       {/* Display className added during fetch */}
                      <strong>Class:</strong> {task.className || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Topic:</strong> {task.topic || 'General'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Deadline:</strong> {due.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Status:</strong> {statusLabel(task.status)}
                    </p>
                     {/* Conditionally render points */}
                     {task.points != null && (
                        <p className="text-sm text-muted-foreground">
                            <strong>Points:</strong> {task.points}
                        </p>
                     )}
                     {/* Conditionally render textbook */}
                     {task.textbook && (
                          <p className="text-sm text-muted-foreground">
                              <strong>Textbook:</strong> {task.textbook}
                          </p>
                     )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Update Task Modal - Original Structure & Styling */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           {/* Use motion for modal appearance */}
           <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card text-foreground rounded-lg p-6 w-full max-w-sm shadow-lg border border-border"
           >
            <h2 className="text-lg font-bold mb-4 text-emphasis">Update Task Status</h2>
            <p className="mb-2 text-muted-foreground">
              <strong>Task:</strong> <span className="text-foreground">{selectedTask.title}</span>
            </p>
            <p className="mb-4 text-muted-foreground">
              <strong>Class:</strong> <span className="text-foreground">{selectedTask.className || 'N/A'}</span>
            </p>
            <div className="space-y-2">
               {/* Complete Button - Original Styling */}
              <button
                className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition disabled:opacity-60"
                onClick={handleComplete}
                disabled={selectedTask.status === 'completed'} // Disable if already completed
              >
                Mark as Completed
              </button>
               {/* Pending/Overdue Button - Original Styling */}
              <button
                className="w-full bg-secondary text-secondary-foreground py-2 rounded hover:bg-secondary/90 transition disabled:opacity-60"
                onClick={handlePending}
                 // Disable if already pending or overdue
                disabled={selectedTask.status === 'pending' || selectedTask.status === 'overdue'}
              >
                {/* Adjust label based on deadline */}
                {new Date(selectedTask.deadline) < new Date() ? 'Mark as Overdue' : 'Mark as Pending'}
              </button>
               {/* Cancel Button - Original Styling */}
              <button
                className="w-full bg-muted text-muted-foreground py-2 rounded hover:bg-accent hover:text-accent-foreground transition"
                onClick={() => setSelectedTask(null)}
              >
                Cancel
              </button>
            </div>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tasks;