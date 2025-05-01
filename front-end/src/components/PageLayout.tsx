// import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function PageLayout() {
  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-tr from-indigo-100 via-blue-100 to-pink-100 overflow-hidden">
      {/* Animated Background Blobs */}
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

      {/* Sidebar and Page Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow overflow-y-auto px-6 py-4 z-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PageLayout;
