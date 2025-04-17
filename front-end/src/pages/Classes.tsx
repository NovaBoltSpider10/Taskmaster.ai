import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Optional: Use '×' if you don't want icon

interface ClassData {
  _id: string;
  name: String,
  professor: String;
  timing: String;
  examDates: String[];
  topics: String[];
  gradingPolicy: String;
  contactInfo: String;
  textbooks: String[];
  location: String;
  user: String;
}

const schema = z.object({
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "File is required",
  }),
});

type FormData = z.infer<typeof schema>;

const SyllabusUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    show: boolean;
  }>({ message: "", type: "success", show: false });
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

  const onSubmit = async (data: FormData) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);

    const userId = "google-oauth2|117092462712380430315";
    const uploadUrl = `http://localhost:3000/user/aisyllabus/${encodeURIComponent(
      userId
    )}/api/upload`;

    try {
      setUploading(true);
      await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setToast({
        message: "File uploaded successfully!",
        type: "success",
        show: true,
      });

      reset(); // ✅ clears file input and triggers watch
    } catch (err) {
      console.error(err);
      setToast({
        message: "Upload failed. Please try again.",
        type: "error",
        show: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const fileName = watch("file")?.[0]?.name ?? null;

  useEffect(() => {
    const fetchClasses = () => {
      setLoading(true);
      setError(null);

      const userId = "google-oauth2|117092462712380430315";

      axios
        .get(`http://localhost:3000/class/user/${userId}`)
        .then((response) => {
          setUserClasses(response.data);
        })
        .catch((err) => {
          console.error("Failed to fetch classes:", err);
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
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
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="w-full h-full p-6 space-y-6">
        {/* Syllabus upload section*/}
        {toast.show && (
          <div
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-md shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
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

        <h1 className="text-2xl font-bold mb-4">AI Syllabus Reader</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Upload Syllabus</h2>

            <label
              htmlFor="file"
              className="relative border-2 border-dashed border-gray-400 rounded-lg p-6 text-center hover:border-gray-600 transition duration-300 block cursor-pointer"
            >
              <p className="text-gray-600">Drag or click to select a file</p>
              <input
                id="file"
                type="file"
                {...register("file")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>

            {/* Validation Error */}
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
            )}

            {/* File Preview */}
            {fileName && (
              <p className="text-sm text-gray-700 mt-2">
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

        {/* Classes Section */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Classes</h1>
          {userClasses.length === 0 && <p>No classes found. Upload a syllabus to get started</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userClasses.map((classItem) => (
              <div
                key={classItem._id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition duration-300"
                style={{ maxWidth: "350px" }} // Slightly bigger card width
              >
                <h2 className="text-lg font-semibold mb-2">
                  {classItem.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Professor:</strong> {classItem.professor}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Location:</strong> {classItem.location}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Timing:</strong> {classItem.timing}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Topics:</strong>
                </p>
                <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto bg-gray-200">
                  <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                    {classItem.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Grading Policy:</strong> {classItem.gradingPolicy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SyllabusUpload;
