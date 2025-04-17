import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

interface TasksData {
  _id: String;
  deadline: string;
  topic: String;
  title: String;
  status: "pending" | "completed" | "overdue";
  points: number | null;
  textbook: String | null;
  class: String;
}

export interface ClassData {
  _id: String; // Optional if coming from MongoDB
  name: String;
  professor: String;
  timing: String;
  examDates: String[]; // ISO Date strings from MongoDB
  topics: String[];
  gradingPolicy: String;
  contactInfo: String;
  textbooks: String[];
  location: String;
  user: String; // user ID (like google-oauth2|...)
}

const Tasks = () => {
  const [userClasses, setUserClasses] = useState<ClassData[] | null>(null);
  const [classTasks, setClassTasks] = useState<{
    [classId: string]: TasksData[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskData = () => {
      setLoading(true);
      setError(null);

      const userid = "google-oauth2|117092462712380430315";

      axios
        .get(`http://localhost:3000/class/user/${userid}`)
        .then((classResponse) => {
          setUserClasses(classResponse.data);

          const taskPromises = classResponse.data.map((classItem: ClassData) =>
            axios
              .get(`http://localhost:3000/tasks/classid/${classItem._id}`)
              .then((taskResponse) => ({
                classId: classItem._id,
                tasks: taskResponse.data,
              }))
          );

          return Promise.all(taskPromises);
        })
        .then((classTaskData) => {
          const tasksMap: { [classId: string]: TasksData[] } = {};
          classTaskData.forEach((data) => {
            tasksMap[data.classId] = data.tasks;
          });
          setClassTasks(tasksMap);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchTaskData();
  }, []);

  // Function to determine background color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-200";
      case "overdue":
        return "bg-red-200";
      case "pending":
        return "bg-yellow-200";
      default:
        return "bg-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex w-full h-full p-6">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        {Object.keys(classTasks).length === 0 && <p>No data found</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(classTasks).map((classId, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-lg font-semibold mb-4">
                Class:{" "}
                {userClasses?.find((cls) => cls._id === classId)?.name ??
                  "Unknown"}
              </h2>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {classTasks[classId].map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className={`rounded-md p-3 shadow-sm ${getStatusColor(
                      task.status
                    )}`}
                  >
                    <h3 className="text-md font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Topic:</strong> {task.topic}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Deadline:</strong>{" "}
                      {new Date(task.deadline).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong> {task.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Points:</strong> {task.points}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Textbook:</strong> {task.textbook}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
