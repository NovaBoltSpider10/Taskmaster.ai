import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FriendCard from '../components/FriendCard';
import FriendDetailsPanel from '../components/FriendDetailsPanel';
import FriendInfoOverlay from '../components/FriendInfoOverlay';

// Mock data - replace with actual API call
interface Friend {
  id: string;
  username: string;
  isOnline: boolean;
  commonCourses: string[];
  notes?: string;
  streak?: number;
  xpAvailable?: boolean;
}

const MOCK_FRIENDS: Friend[] = [
  { id: '1', username: 'AliceWonder', isOnline: true, commonCourses: ['Quantum Physics', 'Creative Writing'], notes: 'Met at the library study group.', streak: 15, xpAvailable: true },
  { id: '2', username: 'BobTheBuilder', isOnline: false, commonCourses: ['Civil Engineering 101'], notes: 'Great at fixing things.', streak: 5 },
  { id: '3', username: 'CharlieChap', isOnline: true, commonCourses: ['Film History', 'Advanced Calculus'], xpAvailable: false },
  { id: '4', username: 'DianaPrince', isOnline: false, commonCourses: ['Ancient History', 'Combat Training'], notes: 'Seems mysterious.', streak: 90, xpAvailable: true },
  { id: '5', username: 'EthanHunt', isOnline: true, commonCourses: ['Espionage Techniques'], streak: 2, xpAvailable: false },
   { id: '6', username: 'FionaApple', isOnline: true, commonCourses: ['Music Theory', 'Poetry'], notes: 'Loves cats.', streak: 30 },
   { id: '7', username: 'GeorgeCostanza', isOnline: false, commonCourses: ['Architecture (Failed)', 'Marine Biology (Claimed)'], notes: 'Always has a scheme.', streak: 1 },
];

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [overlayFriendId, setOverlayFriendId] = useState<string | null>(null);
  const [chatTargetFriendId, setChatTargetFriendId] = useState<string | null>(null);

  useEffect(() => {
    setFriends(MOCK_FRIENDS);
    // Optionally set a default chat target
    if (MOCK_FRIENDS.length > 0 && !chatTargetFriendId) {
      setChatTargetFriendId(MOCK_FRIENDS[0].id);
    }
  }, [chatTargetFriendId]);

  const filteredFriends = useMemo(() => {
    return friends
      .filter(friend => {
        if (filter === 'online') return friend.isOnline;
        if (filter === 'offline') return !friend.isOnline;
        return true; // 'all'
      })
      .filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [friends, searchTerm, filter]);

  const overlayFriend = useMemo(() => {
    return friends.find(f => f.id === overlayFriendId) || null;
  }, [friends, overlayFriendId]);

  const chatTargetFriend = useMemo(() => {
    return friends.find(f => f.id === chatTargetFriendId) || null;
  }, [friends, chatTargetFriendId]);

  const handleSelectOverlayFriend = (id: string) => {
    setOverlayFriendId(id);
  };

  const handleCloseOverlay = () => {
    setOverlayFriendId(null);
  };

  // Function to handle Message button click from overlay
  const handleMessageFromOverlay = (friendId: string) => {
    // Set this friend as the chat target
    setChatTargetFriendId(friendId);
    // Close the overlay
    setOverlayFriendId(null);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emphasis mb-6">Friends</h1>

        <div className="relative bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden" style={{ minHeight: '70vh' }}>
          <div className="flex h-full">
            <div className="w-full md:w-1/3 border-r border-border p-4 flex flex-col">
               <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search friends..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-sm"
                    />
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>

              <div className="flex space-x-2 mb-4">
                {(['all', 'online', 'offline'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      filter === f
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex-grow space-y-1 overflow-y-auto pr-1">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map(friend => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      isSelected={overlayFriendId === friend.id}
                      onClick={() => handleSelectOverlayFriend(friend.id)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No friends found.</p>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-background">
              <FriendDetailsPanel
                friend={chatTargetFriend}
              />
            </div>
          </div>

          <AnimatePresence>
             {overlayFriend && (
               <FriendInfoOverlay
                 key={overlayFriend.id}
                 friend={overlayFriend}
                 onClose={handleCloseOverlay}
                 onMessageButtonClick={handleMessageFromOverlay}
               />
             )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;
