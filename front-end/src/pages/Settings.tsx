import { useState, useEffect } from "react";
import { useTheme, Theme } from "../context/ThemeContext"; // Import useTheme and Theme type
import { useUser } from "../context/UserContext"; // Import useUser
import { motion } from "framer-motion"; // Uncomment if Framer Motion is installed
import { PersonalityData } from "../context/UserContext"; // Import PersonalityData type
import axios from "axios";

// Import existing components or comment out if they don't exist
// import ProfileSettings from '../settings_pages/ProfileSettings';
// import PersonalizationSettings from '../settings_pages/PersonalizationSettings';
// import NotificationSettings from '../settings_pages/NotificationSettings';
// import AccountSettings from '../settings_pages/AccountSettings';
// import PrivacySettings from '../settings_pages/PrivacySettings';

// Remove unused theme/tab types if local state is removed
// type Theme = "light" | "dark" | "clean";
type ActiveTab = "Profile" | "Personalization" | "Notifications" | "Account" | "Privacy" | "Personality";

// Simple Toggle Switch Component (can be moved to a separate file)
interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

interface UserData {
  userName: string;
  email: string;
  _id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-card rounded-md shadow-sm border border-border">
    <label className="text-sm font-medium text-card-foreground">{label}</label>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${enabled ? 'bg-primary' : 'bg-muted'
        }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Profile");
  const { theme, setTheme } = useTheme(); // Use theme and setTheme from context
  const { user, setUserProfile, personalityData, isPersonalityComplete } = useUser();
  const token = localStorage.getItem("token");
  // Local state for form inputs, initialized from context
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    // Add firstName, lastName if needed for editing
  });

  // State for Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    emailPublic: false, // Default: false. Load from user data later.
    discordPublic: false,
    socialMediaPublic: false,
  });

  // Local state for Personality form inputs, initialized from context or defaults
  const [personalityForm, setPersonalityForm] = useState<PersonalityData>(() => {
    return personalityData || {
      introversionExtroversion: 50,
      preferredTime: null,
      interactionType: null,
      preferredSpace: null,
    };
  });

  // Local state for image preview
  const [profilePreview, setProfilePreview] = useState<string | null>(user?.profileImageUrl || null);

  // Update local form state if user context changes (e.g., after login)
  useEffect(() => {
    const setUserData = async () => {
      const userResp = await axios.get<UserData>(
        "http://localhost:3000/user/me", // Use port 3000
        { headers: { "x-auth-token": token } }
      );
      
      if (user) {
        setFormData({
          username: userResp.data.userName,
          email: userResp.data.email,
        });
  
        setProfilePreview(user.profileImageUrl);
      }
      // Update local personality form if context changes
      if (personalityData) {
        setPersonalityForm(personalityData);
      } else {
        // Reset form if personality data is cleared (e.g., logout)
        setPersonalityForm({
          introversionExtroversion: 50,
          preferredTime: null,
          interactionType: null,
          preferredSpace: null,
        });
      }
    };

    setUserData();
  }, [user, personalityData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalityInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    let processedValue: string | number | null = value;

    // Convert slider value to number
    if (name === 'introversionExtroversion') {
      processedValue = parseInt(value, 10);
    }
    // Handle null selection from dropdown
    if ((name === 'preferredTime' || name === 'interactionType') && value === "") {
      processedValue = null;
    }


    setPersonalityForm(prev => {
      const newState = { ...prev, [name]: processedValue };
      // Reset preferredSpace if interactionType is not 'In Person'
      if (name === 'interactionType' && value !== 'In Person') {
        newState.preferredSpace = null;
      }
      // Ensure preferredSpace is null initially if interactionType is not 'In Person'
      if (newState.interactionType !== 'In Person') {
        newState.preferredSpace = null;
      }
      return newState;
    });
  };

  const handlePersonalityRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setPersonalityForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonality = async () => {
    console.log("Saving Personality Data:", personalityForm);

    let interactionType;
    let preferredSpace;
    let preferredTime;

    if (personalityForm.preferredTime == "Morning") {
      preferredTime = 1;
    }
    if (personalityForm.preferredTime == "Afternoon") {
      preferredTime = 2;
    }
    if (personalityForm.preferredTime == "Evening") {
      preferredTime = 3;
    }

    if (personalityForm.interactionType === "In Person") {
      interactionType = 1;

      if (personalityForm.preferredSpace === "Public") {
        preferredSpace = 1;
      }
      else {
        preferredSpace = 0;
      }
    }
    else {
      interactionType = 0;
      preferredSpace = 0;
    }

    const preferencesSend = {
      // "userId": userData._id,
      "personality": personalityForm.introversionExtroversion / 100,
      "preferred_time": preferredTime,
      "in_person": interactionType,
      "private_space": preferredSpace,
    };

    await axios.post('http://localhost:6005/set', preferencesSend)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePrivacySettings = () => {
    console.log("Saving Privacy Settings:", privacySettings);
    // TODO: Add API call here to save privacySettings to the backend
    // e.g., updateUserSettings(userId, { privacy: privacySettings });
    alert("Privacy settings saved (stub)!"); // Placeholder feedback
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

  const tabs: ActiveTab[] = ["Profile", "Personalization", "Notifications", "Account", "Privacy", "Personality"];

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
                    className={`px-4 py-2 rounded-md border transition duration-300 text-sm font-medium capitalize ${theme === themeOption
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
        // Add new Privacy settings content here
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Privacy</h2>
            {/* <PrivacySettings /> */}
            <p className="text-muted-foreground italic text-sm mb-6">Privacy settings component missing. Implement in /settings_pages/PrivacySettings.tsx</p>

            {/* --- New Contact Information Sharing Section --- */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-lg font-medium text-emphasis mb-2">Contact Information Sharing</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose which contact details friends can see or request.</p>

              <ToggleSwitch
                label="Allow friends to see Email"
                enabled={privacySettings.emailPublic}
                onChange={() => handlePrivacyToggle('emailPublic')}
              />
              <ToggleSwitch
                label="Allow friends to see Discord"
                enabled={privacySettings.discordPublic}
                onChange={() => handlePrivacyToggle('discordPublic')}
              />
              <ToggleSwitch
                label="Allow friends to see Social Media Links"
                enabled={privacySettings.socialMediaPublic}
                onChange={() => handlePrivacyToggle('socialMediaPublic')}
              />

              <div className="mt-6">
                <button
                  onClick={handleSavePrivacySettings}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold"
                >
                  Save Privacy Settings
                </button>
              </div>
            </div>
            {/* --- End New Section --- */}

            {/* Placeholder Content - Using theme variables */}
            {/* Keep existing placeholders for now, or remove if replaced by new section */}
            <div className="space-y-4 mt-8 border-t border-border pt-6">
              <h3 className="text-lg font-medium text-emphasis mb-2">Data Management</h3>
              <button className="w-full text-left px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">Request Data Download</button>
              <button className="w-full text-left px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">View Activity Logs</button>
              <button className="w-full text-left px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold">Manage Permissions</button>
            </div>
          </div>
        );
      case "Personality":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-emphasis">Personality Quiz</h2>
            <p className="text-sm text-muted-foreground mb-6">Tell us a bit about your preferences to help tailor your experience.</p>

            {/* Validation Status */}
            {!isPersonalityComplete && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/30 rounded-md text-sm">
                Please complete all questions to enable related features.
              </div>
            )}

            <div className="space-y-8">

              {/* 1. Introversion/Extroversion Slider */}
              <div className="space-y-2">
                <label htmlFor="introversionExtroversion" className="block text-sm font-medium text-foreground">How introverted or extroverted are you?</label>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-muted-foreground">Introverted</span>
                  <input
                    id="introversionExtroversion"
                    name="introversionExtroversion"
                    type="range"
                    min="0"
                    max="100"
                    value={personalityForm.introversionExtroversion}
                    onChange={handlePersonalityInputChange}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">Extroverted</span>
                </div>
                <div className="text-center text-sm font-semibold text-emphasis">{personalityForm.introversionExtroversion}</div>
              </div>

              {/* 2. Preferred Time Dropdown */}
              <div className="space-y-2">
                <label htmlFor="preferredTime" className="block text-sm font-medium text-foreground">What is your preferred study time period?</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={personalityForm.preferredTime || ""} // Handle null state for default option
                  onChange={handlePersonalityInputChange}
                  className="mt-1 block w-full rounded-md border border-input bg-input text-foreground p-2 shadow-sm focus:border-primary focus:ring focus:ring-primary/50"
                >
                  <option value="">Select...</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              {/* 3. Interaction Type Radio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Preferred Interaction Type?</label>
                <div className="flex space-x-4 mt-1">
                  {(['In Person', 'Virtual'] as const).map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="interactionType"
                        value={type}
                        checked={personalityForm.interactionType === type}
                        onChange={handlePersonalityRadioChange}
                        className="form-radio h-4 w-4 text-primary border-border focus:ring-primary/50"
                      />
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              </div>


              {/* 4. Conditional Preferred Space Radio (Only if 'In Person' is selected) */}
              {personalityForm.interactionType === 'In Person' && (
                <div className="space-y-2 pl-4 border-l-2 border-border ml-2">
                  <label className="block text-sm font-medium text-foreground">Preferred meeting space?</label>
                  <div className="flex space-x-4 mt-1">
                    {(['Public', 'Private'] as const).map(space => (
                      <label key={space} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredSpace"
                          value={space}
                          checked={personalityForm.preferredSpace === space}
                          onChange={handlePersonalityRadioChange}
                          className="form-radio h-4 w-4 text-primary border-border focus:ring-primary/50"
                        />
                        <span className="text-sm text-foreground">{space} space</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={handleSavePersonality}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition duration-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  // Optionally disable button if !isPersonalityComplete (though user might want to save partially)
                  disabled={
                    !(
                      personalityForm.introversionExtroversion >= 0 &&
                      personalityForm.preferredTime &&
                      personalityForm.interactionType &&
                      (
                        personalityForm.interactionType !== 'In Person' ||
                        personalityForm.preferredSpace
                      )
                    )
                  }
                >
                  Save Personality Preferences
                </button>
              </div>

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
