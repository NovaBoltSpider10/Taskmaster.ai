import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Friend {
  id: string;
  username: string;
  isOnline: boolean;
  commonCourses: string[];
  notes?: string; // Optional notes
  streak?: number; // Optional streak
  xpAvailable?: boolean; // Optional XP availability
}

interface FriendDetailsPanelProps {
  friend: Friend;
  onClose: () => void;
}

const FriendDetailsPanel: React.FC<FriendDetailsPanelProps> = ({ friend, onClose }) => {
  const [notes, setNotes] = useState(friend.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleRequestContactInfo = () => {
    console.log(`Requesting contact info for ${friend.username}`);
    // Add actual API call or logic here
  };

  const handleEditNotes = () => {
     setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    console.log(`Saving notes for ${friend.username}:`, notes);
     // Add actual API call or logic here to save notes
    setIsEditingNotes(false);
  }

  const handleRedeemStreakXP = () => {
    console.log(`Redeeming streak XP for ${friend.username}`);
    // Add actual API call or logic here
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-y-0 right-0 w-full md:w-2/3 bg-card border-l border-border p-6 space-y-6 overflow-y-auto"
      style={{ fontFamily: "'Inter', sans-serif" }} // Ensure font consistency
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-emphasis">{friend.username}</h2>
         <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Common Courses */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Common Courses</h3>
        {friend.commonCourses.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-foreground">
            {friend.commonCourses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No common courses found.</p>
        )}
      </div>

      {/* Request Contact Info Button */}
      <button
        onClick={handleRequestContactInfo}
        className="w-full px-4 py-2 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground font-medium rounded-md transition-colors duration-200 text-sm"
      >
        Request Contact Info
      </button>

      {/* Personal Notes */}
      <div className="space-y-2">
         <div className="flex justify-between items-center">
             <h3 className="text-sm font-medium text-muted-foreground">Personal Notes</h3>
             {!isEditingNotes ? (
                <button onClick={handleEditNotes} className="text-xs font-medium text-primary hover:underline">Edit</button>
             ) : (
                <button onClick={handleSaveNotes} className="text-xs font-medium text-primary hover:underline">Save</button>
             )}
         </div>
        {isEditingNotes ? (
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm"
                placeholder="Add personal notes about this friend..."
            />
        ) : (
             <p className={`text-sm text-foreground min-h-[4rem] p-2 rounded-md ${notes ? '' : 'text-muted-foreground italic'}`}>
                {notes || 'No notes added yet.'}
            </p>
        )}
      </div>

      {/* Friendship Streak */}
      {friend.streak !== undefined && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Friendship Streak</h3>
          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
            <span className="text-lg font-semibold text-foreground">{friend.streak} days</span>
            {friend.xpAvailable && (
              <button
                onClick={handleRedeemStreakXP}
                className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Redeem XP
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FriendDetailsPanel; 