import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

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

const schema = z.object({
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "File is required",
  }),
});

type FormData = z.infer<typeof schema>;

const Classes = () => {
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error",
    show: false,
  });
  const [userClasses, setUserClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fileName = watch("file")?.[0]?.name ?? null;

  const onSubmit = async (data: FormData) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);

    const userId = "google-oauth2|117092462712380430315";
    const uploadUrl = `http://localhost:5000/user/aisyllabus/${encodeURIComponent(userId)}/api/upload`;

    try {
      setUploading(true);
      await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({
        message: "File uploaded successfully. Please wait up to 2 minutes for data to be parsed",
        type: "success",
        show: true,
      });

      reset();
    } catch (err) {
      console.error(err);
      setToast({
        message: "Fatal Error 404. Please try again.",
        type: "error",
        show: true,
      });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchClasses = () => {
      setLoading(true);
      setError(null);

      const userId = "google-oauth2|117092462712380430315";

      axios
        .get(`http://localhost:5000/class/user/${userId}`)
        .then((res) => setUserClasses(res.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{String(error)}</div>;
  }

  return (
    <div className="relative min-h-screen w-full text-gray-900 dark:text-white px-6 py-10 overflow-hidden">
      <AnimatedBackground />

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-md shadow-lg flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
              : "bg-red-100 dark:bg-red-700 text-red-800 dark:text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-auto text-xl font-bold hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold">AI Syllabus Reader</h1>

        {/* Upload Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-white/90 dark:bg-darkCard rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Upload Syllabus</h2>
            <label
              htmlFor="file"
              className="relative border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-600 dark:hover:border-gray-400 transition cursor-pointer block"
            >
              <p className="text-gray-600 dark:text-gray-300">
                Drag or click to select a file
              </p>
              <input
                id="file"
                type="file"
                {...register("file")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
            )}
            {fileName && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                <strong>Selected File:</strong> {fileName}
              </p>
            )}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Class Cards */}
        <h2 className="text-2xl font-bold">Classes</h2>
        {userClasses.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">
            No classes found. Upload a syllabus to get started.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {userClasses.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-5 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 text-violet-800 dark:text-lavenderAccent">
                {classItem.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <strong>Professor:</strong> {classItem.professor}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <strong>Location:</strong> {classItem.location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <strong>Timing:</strong> {classItem.timing}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <strong>Topics:</strong>
              </p>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 max-h-32 overflow-y-auto bg-gray-200 dark:bg-darkAccent">
                <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200 space-y-1">
                  {classItem.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                <strong>Grading Policy:</strong> {classItem.gradingPolicy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;
