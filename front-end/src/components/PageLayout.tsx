// import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

function PageLayout() {
  const { theme } = useTheme();

  // Styling is now handled by CSS variables based on <html> class (light, dark, clean)
  return (
    <div className="relative flex flex-1 h-screen overflow-hidden">
      {/* Conditionally render Animated Blobs only if theme is NOT clean */}
      {theme !== 'clean' && (
        <>
          <motion.div
            className="absolute w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob z-[-1] top-[-6rem] left-[-4rem]"
            animate={{
              x: [0, 20, -20, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob z-[-1] top-[8rem] left-[8rem]"
            animate={{
              x: [0, -20, 20, 0],
              y: [0, 20, -20, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob z-[-1] bottom-[-6rem] right-[-4rem]"
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -10, 10, 0],
              scale: [1, 0.95, 1.05, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Sidebar remains */}
      <Sidebar />

      {/* Main content area - Apply consistent structure and padding for ALL themes */}
      <main className="ml-56 flex-grow overflow-y-auto z-10 relative">
        {/* Removed conditional structure, apply padding directly */}
        <div className="px-6 py-10 max-w-screen-xl mx-auto"> {/* Consistent padding & max-width */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default PageLayout;