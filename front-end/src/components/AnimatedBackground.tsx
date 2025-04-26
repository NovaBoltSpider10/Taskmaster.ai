import { motion } from "framer-motion";

const squareVariants = {
  float: {
    opacity: [0, 0.3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  },
};

const generateSquares = (count: number) => {
  const squares = [];

  const colorClasses = [
    "bg-pink-400 dark:bg-pink-600",
    "bg-yellow-300 dark:bg-yellow-500",
    "bg-blue-400 dark:bg-blue-600",
    "bg-purple-400 dark:bg-purple-600",
    "bg-green-400 dark:bg-green-600",
    "bg-red-400 dark:bg-red-600",
    "bg-indigo-400 dark:bg-indigo-600",
    "bg-rose-400 dark:bg-rose-600",
    "bg-amber-400 dark:bg-amber-600",
    "bg-teal-400 dark:bg-teal-600",
    "bg-cyan-400 dark:bg-cyan-600",
    "bg-lime-400 dark:bg-lime-600",
    "bg-fuchsia-400 dark:bg-fuchsia-600",
    "bg-orange-400 dark:bg-orange-600",
  ];

  for (let i = 0; i < count; i++) {
    const top = Math.random() * 90;
    const left = Math.random() * 90;
    const size = Math.floor(Math.random() * 104) + 130; // 130–234px
    const delay = Math.random() * 4;

    squares.push(
      <motion.div
        key={i}
        variants={squareVariants}
        initial="hidden"
        animate="float"
        transition={{ delay }}
        className={`absolute ${colorClasses[i % colorClasses.length]} rounded-xl`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
        }}
      />
    );
  }

  return squares;
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#f0f4ff] via-[#fbeeff] to-[#f0f4ff] dark:from-[#1e1e2e] dark:via-[#2a2a3b] dark:to-[#1e1e2e]"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ backgroundSize: "300% 300%" }}
      />

      {/* 14 colorful, gently fading floating squares */}
      {generateSquares(14)}
    </div>
  );
};

export default AnimatedBackground;
