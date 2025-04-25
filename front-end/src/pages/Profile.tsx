import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

const defaultImage = "/user.png";

const mockUser = {
  name: "John Doe",
  username: "johnnyD",
  email: "john@example.com",
  xp: 320,
  xpMax: 500,
};

const Profile = () => {
  const [profilePic, setProfilePic] = useState<string>(defaultImage);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProfilePic(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setProfilePic(defaultImage);
  };

  const xpPercent = Math.min((mockUser.xp / mockUser.xpMax) * 100, 100);

  return (
    <div className="relative min-h-screen w-full text-gray-800 dark:text-white px-6 py-10">
      <AnimatedBackground />

      <div className="relative z-10 max-w-xl mx-auto bg-white/80 dark:bg-[#2a2633] rounded-2xl p-8 shadow-xl space-y-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-purple-700 dark:text-lavenderAccent">
          Profile
        </h1>

        {/* XP Bar */}
        <div>
          <h2 className="text-lg font-semibold mb-2">XP Progress</h2>
          <div className="relative w-full h-6 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-gray-100">
              {mockUser.xp} / {mockUser.xpMax} XP
            </span>
          </div>
        </div>

        {/* Profile Image & Info */}
        <div className="flex flex-col items-center space-y-4">
          <motion.img
            key={profilePic}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={handleImageError}
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-lg bg-white object-cover"
          />

          <label className="cursor-pointer inline-block mt-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="text-center">
            <h3 className="text-xl font-bold">{mockUser.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              @{mockUser.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {mockUser.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
