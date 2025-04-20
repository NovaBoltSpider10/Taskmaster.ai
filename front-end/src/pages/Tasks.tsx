import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

interface TasksData {
  _id: string;
  deadline: string;
  topic: string;
  title: string;
  status: "pending" | "completed" | "overdue";
  points: number | null;
  textbook: string | null;
  class: string;
  className?: string;
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

const Tasks = () => {
  const [tasks, setTasks] = useState<TasksData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TasksData | null>(null);

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      try {
        const userid = "google-oauth2|117092462712380430315";
        const { data: classes } = await axios.get<ClassData[]>(
          `http://localhost:3000/class/user/${userid}`
        );

        const all = await Promise.all(
          classes.map(async (c) => {
            const { data: ts } = await axios.get<TasksData[]>(
              `http://localhost:3000/tasks/classid/${c._id}`
            );
            return ts.map((t) => ({ ...t, className: c.name }));
          })
        );
        const tasksData = all.flat();

        const now = new Date();
        tasksData.forEach((t) => {
          if (t.status === "pending" && new Date(t.deadline) < now) {
            axios.patch(`http://localhost:3000/tasks/${t._id}`, {
              status: "overdue",
            });
            t.status = "overdue";
          }
        });

        setTasks(tasksData);
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load tasks.");
        } else {
          setError("An unexpected error occurred.");
        }
        setLoading(false);
      }
    };
    fetchTaskData();
  }, []);

  const updateTaskStatus = async (
    taskId: string,
    newStatus: TasksData["status"]
  ) => {
    await axios.patch(`http://localhost:3000/tasks/${taskId}`, {
      status: newStatus,
    });
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleComplete = () => {
    if (!selectedTask) return;
    updateTaskStatus(selectedTask._id, "completed").then(() =>
      setSelectedTask(null)
    );
  };

  const handlePending = () => {
    if (!selectedTask) return;
    const now = new Date();
    const due = new Date(selectedTask.deadline);
    const newStatus: TasksData["status"] = due < now ? "overdue" : "pending";
    updateTaskStatus(selectedTask._id, newStatus).then(() =>
      setSelectedTask(null)
    );
  };

  const statusLabel = (t: TasksData) => {
    if (t.status === "completed") return "Complete";
    if (t.status === "overdue") return "Warning: Past Due";
    return "Pending";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return <div className="text-center text-red-500">{String(error)}</div>;

  return (
    <div className="min-h-screen w-full p-6 bg-skyLightest dark:bg-darkBg text-gray-900 dark:text-darkText transition">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        {tasks.length === 0 && (
          <p>No tasks found. Upload a syllabus to get started.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, i) => {
            const due = new Date(task.deadline);
            const bgClass =
              task.status === "completed"
                ? "bg-green-100 dark:bg-green-700/60"
                : task.status === "overdue"
                ? "bg-red-100 dark:bg-red-700/60"
                : "bg-yellow-100 dark:bg-yellow-600/60";

            const textClass =
              task.status === "completed"
                ? "text-green-900 dark:text-green-100"
                : task.status === "overdue"
                ? "text-red-900 dark:text-red-100"
                : "text-yellow-900 dark:text-yellow-100";

            return (
              <motion.div
                key={task._id}
                className={`${bgClass} rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedTask(task)}
              >
                <h3 className={`text-md font-medium ${textClass}`}>
                  {task.title}
                </h3>
                <p className={`text-sm ${textClass}`}>
                  <strong>Class:</strong> {task.className}
                </p>
                <p className={`text-sm ${textClass}`}>
                  <strong>Topic:</strong> {task.topic}
                </p>
                <p className={`text-sm ${textClass}`}>
                  <strong>Deadline:</strong> {due.toLocaleString()}
                </p>
                <p className={`text-sm ${textClass}`}>
                  <strong>Status:</strong> {statusLabel(task)}
                </p>
                <p className={`text-sm ${textClass}`}>
                  <strong>Points:</strong> {task.points}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkCard text-gray-800 dark:text-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Update Task Status</h2>
            <p className="mb-2">
              <strong>Task:</strong> {selectedTask.title}
            </p>
            <p className="mb-4">
              <strong>Class:</strong> {selectedTask.className}
            </p>
            <div className="space-y-2">
              <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={handleComplete}
              >
                Mark as Completed
              </button>
              <button
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                onClick={handlePending}
              >
                Mark as Pending
              </button>
              <button
                className="w-full bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                onClick={() => setSelectedTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
