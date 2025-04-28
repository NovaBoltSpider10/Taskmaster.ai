import { useState, useEffect } from "react";
import { useTheme, Theme } from "../context/ThemeContext"; // Import useTheme and Theme type
import { useUser } from "../context/UserContext"; // Import useUser
import { motion } from "framer-motion"; // Uncomment if Framer Motion is installed

// Import existing components or comment out if they don't exist
// import ProfileSettings from '../settings_pages/ProfileSettings';
// import PersonalizationSettings from '../settings_pages/PersonalizationSettings';
// import NotificationSettings from '../settings_pages/NotificationSettings';
// import AccountSettings from '../settings_pages/AccountSettings';
// import PrivacySettings from '../settings_pages/PrivacySettings';

// Remove unused theme/tab types if local state is removed
// type Theme = "light" | "dark" | "clean";
type ActiveTab = "Profile" | "Personalization" | "Notifications" | "Account" | "Privacy";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Profile");
  const { theme, setTheme } = useTheme(); // Use theme and setTheme from context
  const { user, setUserProfile } = useUser(); // Get user state and updater

  // Local state for form inputs, initialized from context
  const [formData, setFormData] = useState({
      username: user?.username || '',
      email: user?.email || '',
      // Add firstName, lastName if needed for editing
  });

  // Local state for image preview
  const [profilePreview, setProfilePreview] = useState<string | null>(user?.profileImageUrl || null);

  // Update local form state if user context changes (e.g., after login)
  useEffect(() => {
    if (user) {
        setFormData({
            username: user.username,
            email: user.email,
        });
        setProfilePreview(user.profileImageUrl);
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 1. Create a preview URL (local)
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);

      // 2. TODO: Implement actual image upload logic here
      //    - Upload `file` to your backend/storage
      //    - Get the permanent URL back from the server
      //    - Call setUserProfile({ profileImageUrl: permanentUrl })
      console.log("Profile picture selected (preview only):", file.name);
      // Example: Simulate upload and update context after 2s
      // setTimeout(() => {
      //    const permanentUrl = `/path/to/uploaded/${file.name}`; // Replace with actual URL
      //    setUserProfile({ profileImageUrl: permanentUrl });
      //    console.log("Simulated upload complete, context updated.");
      // }, 2000);
    }
  };

  const handleSaveChanges = () => {
      if (!user) return; // Should not happen if logged in
      // Update user context with form data
      setUserProfile({
          username: formData.username,
          email: formData.email,
          // Update firstName, lastName if they are part of the form
      });
      // Optionally show a success toast
      alert("Profile updated!"); // Simple feedback
  };

  const toggleNotificationSetting = (setting: string) => {
    console.log(`Toggled notification setting: ${setting}`);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        console.log("Account deletion requested.");
    }
  };

  const tabs: ActiveTab[] = ["Profile", "Personalization", "Notifications", "Account", "Privacy"];

  const renderContent = () => {
    // Restore original content structure
    switch (activeTab) {
      case "Profile":
        // Restore original Profile placeholder content
        return (
          <div>
             <h2 className="text-xl font-semibold mb-4 text-emphasis">Profile Settings</h2>
             {/* <ProfileSettings handleProfileUpload={handleProfileUpload} /> */}
             <p className="text-muted-foreground italic text-sm">Profile Settings component missing. Implement in /settings_pages/ProfileSettings.tsx</p>
             {/* Placeholder Content */}
             <div className="space-y-6 mt-4">
               <div className="flex items-center space-x-4">
                 {profilePreview ? (
                     <img src={profilePreview} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
                 ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <span className="text-xs">No Image</span>
                    </div>
                 )}
                 <div>
                    <label htmlFor="profilePicInput" className="cursor-pointer text-sm font-medium text-primary hover:underline">Upload Profile Picture</label>
                    <input id="profilePicInput" type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
                 </div>
               </div>
               <div>
                 <label htmlFor="username" className="block text-sm font-medium text-foreground">Username</label>
                 <input
                    id="username"
                    name="username" // Name matches state key
                    type="text"
                    placeholder="Your username"
                    value={formData.username} // Controlled component
                    onChange={handleInputChange} // Update local state
                    className="mt-1 block w-full rounded-md border border-input bg-input text-foreground p-2 shadow-sm focus:border-primary focus:ring focus:ring-primary/50"
                 />
               </div>
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
                 <input
                    id="email"
                    name="email" // Name matches state key
                    type="email"
                    placeholder="Your email"
                    value={formData.email} // Controlled component
                    onChange={handleInputChange} // Update local state
                    className="mt-1 block w-full rounded-md border border-input bg-input text-foreground p-2 shadow-sm focus:border-primary focus:ring focus:ring-primary/50"
                  />
               </div>
               <button
                  onClick={handleSaveChanges} // Call function to update context
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold"
                >
                  Save Changes
                </button>
             </div>
          </div>
        );
      case "Personalization":
        // Keep the updated Personalization content
        return (
          <div>
             <h2 className="text-xl font-semibold mb-4 text-emphasis">Personalization</h2>
             <div className="space-y-4 mt-4">
               <p className="text-sm font-medium text-foreground">Select Theme:</p>
               <div className="flex space-x-4">
                 {(['light', 'dark', 'clean'] as Theme[]).map((themeOption) => (
                   <button
                     key={themeOption}
                     onClick={() => {
                       // Removed console log for clarity now
                       setTheme(themeOption);
                     }}
                     className={`px-4 py-2 rounded-md border transition duration-300 text-sm font-medium capitalize ${
                       theme === themeOption
                         ? 'bg-primary text-primary-foreground border-primary/50 ring-2 ring-primary'
                         : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground border-border'
                     }`}
                   >
                     {themeOption === 'clean' ? 'Beige' : themeOption}
                   </button>
                 ))}
               </div>
                <div className="mt-4 p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-semibold text-card-foreground mb-2 capitalize">{theme === 'clean' ? 'Beige' : theme} Mode Active</h3>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' && "The default light theme with vibrant accents."}
                    {theme === 'dark' && "A dark theme designed for low-light environments."}
                    {theme === 'clean' && "The minimalist beige-core theme."}
                  </p>
                </div>
            </div>
          </div>
        );
      case "Notifications":
        // Restore original Notifications placeholder content
        return (
          <div>
             <h2 className="text-xl font-semibold mb-4 text-foreground">Notifications</h2>
             {/* <NotificationSettings toggleNotificationSetting={toggleNotificationSetting} /> */}
             <p className="text-muted-foreground italic text-sm">Notification Settings component missing. Implement in /settings_pages/NotificationSettings.tsx</p>
             {/* Placeholder Content - Using theme variables */}
             <div className="space-y-4 mt-4">
                 <div className="flex items-center justify-between p-3 bg-card rounded-md shadow-sm border border-border">
                     <label htmlFor="emailNotifications" className="text-sm font-medium text-card-foreground">Email Notifications</label>
                     <button onClick={() => toggleNotificationSetting('email')} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-xs font-semibold">Toggle</button>
                 </div>
                  <div className="flex items-center justify-between p-3 bg-card rounded-md shadow-sm border border-border">
                     <label htmlFor="appAlerts" className="text-sm font-medium text-card-foreground">App Alerts</label>
                     <button onClick={() => toggleNotificationSetting('appAlerts')} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-xs font-semibold">Toggle</button>
                 </div>
                  <div className="flex items-center justify-between p-3 bg-card rounded-md shadow-sm border border-border">
                     <label htmlFor="marketingEmails" className="text-sm font-medium text-card-foreground">Marketing Emails</label>
                     <button onClick={() => toggleNotificationSetting('marketing')} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-xs font-semibold">Toggle</button>
                 </div>
             </div>
          </div>
        );
       case "Account":
         // Restore original Account placeholder content
         return (
           <div>
             <h2 className="text-xl font-semibold mb-4 text-foreground">Account</h2>
             {/* <AccountSettings /> */}
             <p className="text-muted-foreground italic text-sm">Account Settings component missing. Implement in /settings_pages/AccountSettings.tsx</p>
             {/* Placeholder Content - Using theme variables */}
             <div className="space-y-6 mt-4">
                 <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Change Password</label>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">Change Password</button>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Manage Connected Accounts</label>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">Manage Accounts</button>
                 </div>
                 <div className="border-t border-destructive pt-4 mt-4">
                    <label className="block text-sm font-medium text-destructive">Delete Account</label>
                    <p className="text-xs text-destructive/80 mb-2">Permanently delete your account and all associated data.</p>
                    <button onClick={handleDeleteAccount} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">Delete Account</button>
                 </div>
             </div>
           </div>
         );
       case "Privacy":
         // Restore original Privacy placeholder content
         return (
          <div>
             <h2 className="text-xl font-semibold mb-4 text-foreground">Privacy</h2>
             {/* <PrivacySettings /> */}
              <p className="text-muted-foreground italic text-sm">Privacy Settings component missing. Implement in /settings_pages/PrivacySettings.tsx</p>
             {/* Placeholder Content - Using theme variables */}
             <div className="space-y-4 mt-4">
                <button className="w-full text-left px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">Request Data Download</button>
                <button className="w-full text-left px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">View Activity Logs</button>
                <button className="w-full text-left px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">Manage Permissions</button>
            </div>
          </div>
         );
      default:
        return null;
    }
  };

  // Remove console log
  // console.log('Settings component re-rendered. Active tab:', activeTab);

  return (
    // Use theme variables for main container styles
    <div className="min-h-screen bg-background p-6 font-sans text-foreground">
       <h1 className="text-3xl font-bold text-emphasis mb-6">Settings</h1>
       {/* Main container with theme-aware card styles & soft shadow */}
      <div className="bg-card text-card-foreground rounded-lg shadow-soft flex border border-border">
        {/* Left Sidebar - Use theme variables */}
        <div className="w-1/4 border-r border-border p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-300 text-sm font-medium
                  ${activeTab === tab
                    ? 'bg-primary text-primary-foreground' // Active tab style using theme vars
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground' // Inactive tab style using theme vars
                  }`
                }
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area - Use theme variables */}
        <div className="w-3/4 p-8">
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
           >
             {renderContent()}
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

// CSS Variables defined in index.css now handle the theme switching.
// The `clean` theme specifics (fonts, colors, radius, shadow) are set via
// CSS variables under the `html.clean` selector in index.css.
// Ensure fonts are installed/imported as noted in index.css if needed.
// Component now uses theme-agnostic Tailwind classes like `bg-background`,
// `text-foreground`, `bg-primary`, `border-border` etc., which adapt
// based on the class (`light`, `dark`, `clean`) applied to the <html> element.

// Removed previous tailwind config/CSS comments as they are now in index.css
