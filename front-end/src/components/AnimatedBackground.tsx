import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <motion.div
      className="fixed inset-0 -z-10 bg-gradient-to-r from-[#f0f4ff] via-[#fbeeff] to-[#f0f4ff] dark:from-[#1e1e2e] dark:via-[#2a2a3b] dark:to-[#1e1e2e]"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        backgroundSize: "300% 300%",
      }}
    />
  );
};

export default AnimatedBackground;
