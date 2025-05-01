import axios from "axios";
import { useEffect, useState } from "react";

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

        // 1) fetch classes
        const classesRes = await axios.get<ClassData[]>(
          `http://localhost:3000/class/user/${userId}`
        );
        setUserClasses(classesRes.data);

        // 2) fetch resources for each class in parallel
        const resourcesPromises = classesRes.data.map((cls) =>
          axios.get<ResourceData[]>(
            `http://localhost:3000/resources/class/${cls._id}`
          )
        );
        const resourcesResults = await Promise.all(resourcesPromises);

        // flatten the arrays (each endpoint returns an array of length 1)
        const allResources = resourcesResults.flatMap((r) => r.data);
        setResources(allResources);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load data.");
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
    return <div className="text-center text-red-500">{String(error)}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Class Resources</h2>
      {userClasses.length === 0 ? (
        <p className="text-center text-gray-600">No classes found for your account.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {userClasses.map((cls) => {
            const res = resources.find((r) => r.class === cls._id);
            return (
              <div
                key={cls._id}
                className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-shadow duration-300 max-w-sm w-full mx-auto"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {cls.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Professor:</strong> {cls.professor}
                </p>
                {res && res.urls.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Resources:
                    </h4>
                    <div className="space-y-1">
                      {res.urls.map((url, i) => (
                        <div key={i} className="border-b border-gray-300 pb-1">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block truncate"
                          >
                            {url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-500">
                    No resources available.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Resources;