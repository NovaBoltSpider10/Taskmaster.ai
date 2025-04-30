import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { setTasks as setTasksStore } from "../components/tasksStore";

export interface TasksData {
  _id: string;
  deadline: string;
  topic: string;
  title: string;
  status: "pending" | "completed" | "overdue";
  points: number | null;
  textbook: string | null;
  class: string;
  className?: string;
  classLocation?: string;
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
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      try {
        const userid = "google-oauth2|117092462712380430315";
        const { data: classes } = await axios.get<ClassData[]>(
          `http://localhost:5000/class/user/${userid}`
        );

        const all = await Promise.all(
          classes.map(async (c) => {
            const { data: ts } = await axios.get<TasksData[]>(
              `http://localhost:5000/tasks/classid/${c._id}`
            );
            return ts.map((t) => ({ ...t, className: c.name, classLocation: c.location, }));
          })
        );
        const tasksData = all.flat();

        const now = new Date();
        tasksData.forEach((t) => {
          if (t.status === "pending" && new Date(t.deadline) < now) {
            axios.patch(`http://localhost:5000/tasks/${t._id}`, {
              status: "overdue",
            });
            t.status = "overdue";
          }
        });

        setTasks(tasksData);
        setTasksStore(tasksData); // Update the tasks store
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
    await axios.patch(`http://localhost:5000/tasks/${taskId}`, {
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

  const statusLabel = (status: TasksData["status"]) => {
    if (status === "completed") return "Completed";
    if (status === "overdue") return "Overdue";
    return "Pending";
  };

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );

  if (error)
    return <div className="text-center text-destructive">{String(error)}</div>;

  return (
    <div className="relative min-h-screen w-full text-gray-900 dark:text-darkText transition">
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <div className="w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h1 className="text-2xl font-bold mb-4 md:mb-0 text-emphasis">Tasks</h1>
            <div className="flex items-center gap-3">
              <label htmlFor="filter" className="text-sm font-medium text-foreground">
                Filter by Status:
              </label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 rounded-md border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks match the selected filter.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {filteredTasks.map((task, i) => {
                const due = new Date(task.deadline);
                const statusBorderClass =
                  task.status === "completed"
                    ? "border-green-500"
                    : task.status === "overdue"
                    ? "border-destructive"
                    : "border-primary";

                return (
                  <motion.div
                    key={task._id}
                    className={`bg-card text-card-foreground rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 cursor-pointer border-l-4 ${statusBorderClass}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <h3 className="text-md font-medium text-foreground">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Class:</strong> {task.className}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Topic:</strong> {task.topic}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Deadline:</strong> {due.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Status:</strong> {statusLabel(task.status)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Points:</strong> {task.points ?? 'N/A'}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card text-foreground rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-emphasis">Update Task Status</h2>
            <p className="mb-2 text-muted-foreground">
              <strong>Task:</strong> <span className="text-foreground">{selectedTask.title}</span>
            </p>
            <p className="mb-4 text-muted-foreground">
              <strong>Class:</strong> <span className="text-foreground">{selectedTask.className}</span>
            </p>
            <div className="space-y-2">
              <button
                className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition"
                onClick={handleComplete}
              >
                Mark as Completed
              </button>
              <button
                className="w-full bg-secondary text-secondary-foreground py-2 rounded hover:bg-secondary/90 transition"
                onClick={handlePending}
              >
                Mark as Pending/Overdue
              </button>
              <button
                className="w-full bg-muted text-muted-foreground py-2 rounded hover:bg-accent hover:text-accent-foreground transition"
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
