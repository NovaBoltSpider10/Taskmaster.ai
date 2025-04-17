import Sidebar from "../components/sibebar";
import AuthHeader from "../components/AuthHeader";
import { motion } from "framer-motion";

function Syllabus() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AuthHeader />

      <div className="flex flex-1">
        <Sidebar />

        {/* Animate Gradient BG */}
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-900 via-blue-700 via-indigo-600 via-cyan-500 via-blue-600 to-blue-900"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          style={{
            backgroundSize: "400% 400%",
          }}
        />

        {/* Main Content */}
        <div className="flex-1 p-6 min-h-screen text-white">
          <h1 className="text-3xl font-bold mb-6">Syllabus</h1>
          <p className="text-gray-300">Syllabus drop code code</p>
        </div>
      </div>
    </div>
  );
}

export default Syllabus;
