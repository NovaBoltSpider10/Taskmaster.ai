import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

interface UserData {
  _id: string;
}

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userClasses, setUserClasses] = useState<ClassData[] | null>(null);
  const [tasks, setTasks] = useState<TasksData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<TasksData | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setError(null);
  
    axios
      // 1) get current user
      .get<UserData>("http://localhost:3000/user/me", {
        headers: { "x-auth-token": token },
      })
      .then((userResp) => {
        const user = userResp.data;
        setUserData(user);
  
        // 2) get that user’s classes
        return axios.get<ClassData[]>(
          `http://localhost:3000/class/user/${user._id}`
        );
      })
      .then((classResp) => {
        const classes = classResp.data;
        setUserClasses(classes);
  
        // 3) fetch tasks for each class in parallel, tagging with className
        return Promise.all(
          classes.map((c) =>
            axios
              .get<TasksData[]>(`http://localhost:3000/tasks/classid/${c._id}`)
              .then((taskResp) =>
                taskResp.data.map((t) => ({ ...t, className: c.name }))
              )
          )
        );
      })
      .then(async (nestedTasks) => {
        // flatten the array-of-arrays
        const tasksData = nestedTasks.flat();
  
        // 4) auto-patch any overdue “pending” tasks
        const now = new Date();
        const patchCalls = tasksData
          .filter((t) => t.status === "pending" && new Date(t.deadline) < now)
          .map((t) =>
            axios
              .patch(`http://localhost:3000/tasks/${t._id}`, { status: "overdue" })
              .then(() => {
                t.status = "overdue";
              })
          );
  
        // wait for all patches (if any), then carry on with the full list
        return Promise.all(patchCalls).then(() => tasksData);
      })
      .then((finalTasks) => {
        setTasks(finalTasks);
      })
      .catch((err) => {
        console.error("Error fetching task data:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);
  

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
    // if the deadline’s already passed, mark it overdue instead
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
    <div className="flex w-full h-full p-6">
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
                ? "bg-green-200"
                : task.status === "overdue"
                ? "bg-red-200"
                : "bg-yellow-200";
            const textClass =
              task.status === "completed"
                ? "text-green-800"
                : task.status === "overdue"
                ? "text-red-800"
                : "text-yellow-800";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Update Task Status</h2>
            <p className="mb-4">
              <strong>Task:</strong> {selectedTask.title}
            </p>
            <p className="mb-4">
              <strong>Class:</strong> {selectedTask.className}
            </p>
            <p className="mb-4">
              <strong>Deadline:</strong> {selectedTask.deadline}
            </p>
            <div className="space-y-2">
              <button
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
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
                className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
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
