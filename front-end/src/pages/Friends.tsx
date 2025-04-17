import Sidebar from "../components/sibebar";
import { motion } from "framer-motion";

function Friends() {
  


  const currentTime = () => {
    let greeting: string = "";

    const now = new Date();
    const hours = now.getHours();

    if (hours >= 12 && hours < 18) {
      //Between 12pm to 6pm
      greeting = "Good Afternoon";
    } else if (hours >= 18 && hours < 22) {
      greeting = "Good Evening"; //From 6pm to 12am
    } else if ((hours >= 22 && hours <= 23) || (hours >= 0 && hours < 5)) {
      greeting = "Good Morning"; //From 10pm to 5am
    } else {
      greeting = "Good Morning"; // From 5am to 12pm
    }
    console.log(hours);

    return greeting;
  };

  return (
    <div className="relative flex">
      <Sidebar />

      {/* Animate Gradien. Bg */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-900 via-blue-700 via-indigo-600 via-cyan-500 via-blue-600 to-blue-900"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 4, // Faster animation
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut", // Smoother transition
        }}
        style={{
          backgroundSize: "400% 400%", // Larger size for more vibrant effect
        }}
      ></motion.div>

      <div className="flex-1 p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-white">{currentTime()}</h1>

        <h1 className="text-3xl font-bold mb-6 text-white">Friends code</h1>
      </div>
    </div>
  );
}

export default Friends;
