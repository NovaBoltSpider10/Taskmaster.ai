import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

// Interface for class data (using lowercase string)
interface ClassData {
  _id: string;
  name: string; // Standardized to lowercase string
  professor: string; // Standardized to lowercase string
  timing: string; // Standardized to lowercase string
  examDates: string[]; // Standardized to lowercase string array
  topics: string[]; // Standardized to lowercase string array
  gradingPolicy: string; // Standardized to lowercase string
  contactInfo: string; // Standardized to lowercase string
  textbooks: string[]; // Standardized to lowercase string array
  location: string; // Standardized to lowercase string
  user: string; // Standardized to lowercase string
}

// Interface for user data from /me endpoint
interface UserData {
  _id: string;
}

// Form schema remains the same
const schema = z.object({
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "File is required",
  }),
});

type FormData = z.infer<typeof schema>;

const Classes = () => {
  // Original state variables
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error",
    show: false,
  });
  const [userClasses, setUserClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false); // Combined loading state
  const [error, setError] = useState<string | null>(null); // Use string for error message

  // State and constant added for backend integration
  const [userData, setUserData] = useState<UserData | null>(null); // Store fetched user data (optional)
  const token = localStorage.getItem("token"); // Get token

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

  // onSubmit updated with backend integration logic
  const onSubmit = async (data: FormData) => {
    if (!token) {
        setToast({ message: "Authentication token not found. Please log in.", type: "error", show: true });
        return;
    }

    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setToast({ message: "", type: "success", show: false }); // Clear previous toast

    try {
      // 1. Get user ID from /me endpoint
      const userResp = await axios.get<UserData>(
        "http://localhost:5000/user/me", // Use port 5000
        { headers: { "x-auth-token": token } }
      );
      const userId = userResp.data._id;
      setUserData(userResp.data); // Store user data if needed elsewhere

      // 2. Upload the file using the fetched user ID
      const uploadUrl = `http://localhost:5000/user/aisyllabus/${userId}/api/upload`; // Use port 5000
      await axios.post(uploadUrl, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            // Add auth token if required by the upload endpoint
            // "x-auth-token": token
         },
      });

      // Use original success toast message
      setToast({
        message: "File uploaded successfully. Please wait up to 2 minutes for data to be parsed",
        type: "success",
        show: true,
      });
      reset(); // Clears file input

      // Optionally: Trigger a refetch of classes after successful upload
      // fetchClasses(); // You would need to extract fetchClasses logic to call it here

    } catch (err: any) {
      console.error("Upload Error:", err);
      // Use original error toast message style, but potentially more specific error
      const message = err.response?.data?.message || err.message || "File upload failed. Please try again.";
      setToast({
        message: message,
        type: "error",
        show: true,
      });
    } finally {
      setUploading(false);
    }
  };

  // useEffect updated with backend integration logic
  useEffect(() => {
    const fetchClasses = async () => { // Make the function async
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        setUserClasses([]); // Ensure classes are cleared if no token
        return;
      }

      try {
        // 1. Get user ID from /me endpoint
        const userResp = await axios.get<UserData>(
          "http://localhost:5000/user/me", // Use port 5000
          { headers: { "x-auth-token": token } }
        );
        const userId = userResp.data._id;
        setUserData(userResp.data); // Store user data if needed

        // 2. Fetch classes using the obtained user ID
        // Assuming token might be needed for this endpoint too
        const classResp = await axios.get<ClassData[]>(
          `http://localhost:5000/class/user/${userId}`, // Use port 5000 and fetched userId
          { headers: { "x-auth-token": token } }
        );
        setUserClasses(classResp.data);

      } catch (err: any) {
        console.error("Failed to fetch classes:", err);
        const message = err.response?.data?.message || err.message || "Failed to load classes.";
        setError(message); // Set specific error message
        setUserClasses([]); // Clear classes on error
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]); // Re-run effect if token changes


  // --- Original JSX Structure and Styling (Unaltered) ---

  // Loading State - Original Styling
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Original spinner */}
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Error State - Original Styling (Displays only critical fetch errors now)
  if (error && userClasses.length === 0 && !loading) { // Show full page error only if loading failed critically
    return <div className="text-center text-destructive p-6">{error}</div>;
  }

  // Main component return - Original Structure & Styling
  return (
    // Added relative positioning and min-height for better layout context
    <div className="relative min-h-screen w-full text-gray-900 dark:text-white px-6 py-10">
      {/* Toast Notification - Original Styling */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-md shadow-lg flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-primary/10 text-primary" // Original success style
              : "bg-destructive/10 text-destructive" // Original error style
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-auto text-xl font-bold hover:text-destructive/80 transition" // Original close button style
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
         {/* Display non-critical fetch errors here */}
         {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md border border-destructive/30">{error}</div>}

        {/* Title - Original Styling */}
        <h1 className="text-3xl font-bold text-emphasis">AI Syllabus Reader</h1>

        {/* Form - Original Structure & Styling */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-emphasis">Upload Syllabus</h2>
            <label
              htmlFor="file"
              className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition cursor-pointer block bg-background"
            >
              <p className="text-muted-foreground">
                Drag or click to select a file (PDF, DOCX)
              </p>
              <input
                id="file"
                type="file"
                 accept=".pdf,.doc,.docx" // Added accept attribute for clarity
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

        {/* Classes Section - Original Structure & Styling */}
        <h2 className="text-2xl font-bold text-emphasis">Classes</h2>
        {userClasses.length === 0 && !loading && ( // Check loading state too
          <p className="text-muted-foreground">
            No classes found. Upload a syllabus to get started.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {userClasses.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-card border border-border rounded-lg shadow-md p-5 hover:shadow-lg transition duration-300 flex flex-col" // Added flex-col for potential future actions
            >
              <h3 className="text-lg font-semibold mb-2 text-emphasis">
                {classItem.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Professor:</strong> {classItem.professor}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Location:</strong> {classItem.location || "N/A"} {/* Added fallback */}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Timing:</strong> {classItem.timing || "N/A"} {/* Added fallback */}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Topics:</strong>
              </p>
              {/* Topics List Styling - Original Styling */}
              <div className="border border-input rounded-md p-3 max-h-32 overflow-y-auto bg-muted mb-3"> {/* Added mb-3 */}
                {classItem.topics && classItem.topics.length > 0 ? (
                     <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {classItem.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                        ))}
                    </ul>
                 ) : (
                     <p className="text-xs italic text-muted-foreground">No topics listed.</p>
                 )}
              </div>
              <p className="text-sm text-muted-foreground mt-auto"> {/* Use mt-auto to push grading policy down if needed */}
                <strong>Grading Policy:</strong> {classItem.gradingPolicy || "N/A"} {/* Added fallback */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;