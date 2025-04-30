import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

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
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive">{String(error)}</div>;
  }

  return (
    <div className="w-full">
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-md shadow-lg flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-auto text-xl font-bold hover:text-destructive/80 transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-emphasis">AI Syllabus Reader</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-emphasis">Upload Syllabus</h2>
            <label
              htmlFor="file"
              className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition cursor-pointer block bg-background"
            >
              <p className="text-muted-foreground">
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
              <p className="text-destructive text-sm mt-1">{errors.file.message}</p>
            )}
            {fileName && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Selected File:</strong> {fileName}
              </p>
            )}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>

        <h2 className="text-2xl font-bold text-emphasis">Classes</h2>
        {userClasses.length === 0 && (
          <p className="text-muted-foreground">
            No classes found. Upload a syllabus to get started.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {userClasses.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-card border border-border rounded-lg shadow-md p-5 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 text-emphasis">
                {classItem.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Professor:</strong> {classItem.professor}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Location:</strong> {classItem.location}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Timing:</strong> {classItem.timing}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Topics:</strong>
              </p>
              <div className="border border-input rounded-md p-3 max-h-32 overflow-y-auto bg-muted">
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {classItem.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
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
