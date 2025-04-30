import axios from "axios";
import { useEffect, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import React from "react";

interface ResourceData {
  _id: string;
  urls: string[];
  class: string;
}

interface ClassData {
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

const Resources = () => {
  const [userClasses, setUserClasses] = useState<ClassData[]>([]);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassesAndResources = async () => {
      setLoading(true);
      setError(null);

      try {
        const userId = "google-oauth2|117092462712380430315";
        const classesRes = await axios.get<ClassData[]>(
          `http://localhost:3000/class/user/${userId}`
        );
        setUserClasses(classesRes.data);

        const resourcesPromises = classesRes.data.map((cls) =>
          axios.get<ResourceData[]>(
            `http://localhost:3000/resources/class/${cls._id}`
          )
        );
        const resourcesResults = await Promise.all(resourcesPromises);
        const allResources = resourcesResults.flatMap((r) => r.data);
        setResources(allResources);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load data.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndResources();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 dark:text-red-400">{error}</div>
    );

  return (
    <div className="relative min-h-screen w-full text-gray-900 dark:text-darkText transition">
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">
          Your Class Resources
        </h2>

        {userClasses.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No classes found for your account.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center pb-10">
            {userClasses.map((cls) => {
              const res = resources.find((r) => r.class === cls._id);
              return (
                <div
                  key={cls._id}
                  className="bg-white dark:bg-darkCard shadow-md rounded-md p-4 hover:shadow-lg transition-shadow duration-300 max-w-sm w-full mx-auto border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Professor:</strong> {cls.professor}
                  </p>
                  {res && res.urls.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resources:
                      </h4>
                      <div className="space-y-1">
                        {res.urls.map((url, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-300 dark:border-gray-600 pb-1"
                          >
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 block truncate"
                            >
                              {url}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-500 dark:text-gray-400">
                      No resources available.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
