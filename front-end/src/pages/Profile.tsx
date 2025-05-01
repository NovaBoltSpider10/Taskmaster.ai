import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

const defaultImage = "/user.png";

const Profile = () => {
  const { user, setUserProfile } = useUser();
  const { theme } = useTheme();
  
  const [profilePic, setProfilePic] = useState<string>(user?.profileImageUrl || defaultImage);
  
  const mockXP = {
    current: 320,
    max: 500,
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const imageDataUrl = reader.result as string;
          setProfilePic(imageDataUrl);
          
          setUserProfile({ profileImageUrl: imageDataUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setProfilePic(defaultImage);
  };

  const xpPercent = Math.min((mockXP.current / mockXP.max) * 100, 100);

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-6 py-10">
      <AnimatedBackground />

      <div className="relative z-10 max-w-xl mx-auto bg-card text-card-foreground rounded-2xl p-8 shadow-lg border border-border space-y-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-emphasis">
          Profile
        </h1>

        {/* XP Bar */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-emphasis">XP Progress</h2>
          <div className="relative w-full h-6 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-primary"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-foreground">
              {mockXP.current} / {mockXP.max} XP
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
            className="w-32 h-32 rounded-full border-4 border-input shadow-lg bg-background object-cover"
          />

          <label className="cursor-pointer inline-block mt-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="text-center">
            <h3 className="text-xl font-bold text-emphasis">{user?.userName || 'Username'}</h3>
            <p className="text-sm text-muted-foreground">
              {user?.email || 'email@example.com'}
            </p>
            {(user?.firstName || user?.lastName) && (
              <p className="text-sm text-muted-foreground mt-1">
                {user?.firstName} {user?.lastName}
              </p>
            )}
          </div>
          
          {/* Current Theme Information */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg w-full">
            <h3 className="text-sm font-medium text-emphasis mb-2">Current Theme</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full bg-primary`}></div>
              <span className="text-sm capitalize">{theme === 'clean' ? 'Beige' : theme}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
