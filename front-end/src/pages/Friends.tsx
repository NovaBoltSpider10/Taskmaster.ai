import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FriendCard from '../components/FriendCard';
import FriendDetailsPanel from '../components/FriendDetailsPanel';

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
  const [friends, setFriends] = useState<Friend[]>([]); // Initialize with empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all'); // Simplified filter
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  // Simulate fetching friends data
  useEffect(() => {
    // In a real app, fetch data here
    setFriends(MOCK_FRIENDS);
  }, []);

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

  const selectedFriend = useMemo(() => {
    return friends.find(f => f.id === selectedFriendId) || null;
  }, [friends, selectedFriendId]);

  const handleSelectFriend = (id: string) => {
    setSelectedFriendId(id);
  };

  const handleCloseDetails = () => {
    setSelectedFriendId(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#fdfdfb] dark:bg-gray-900 text-foreground" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emphasis mb-6">Friends</h1>

        <div className="relative bg-card dark:bg-card-dark text-card-foreground dark:text-card-foreground-dark rounded-2xl shadow-sm border border-border dark:border-border-dark overflow-hidden" style={{ minHeight: '70vh' }}>
          <div className="flex h-full">
            {/* Left Sidebar: Friends List */}
            <div className={`w-full md:w-1/3 border-r border-border dark:border-border-dark p-4 space-y-4 transition-all duration-300 ease-in-out ${selectedFriendId ? 'hidden md:block' : 'block'}`}>
               {/* Search Bar */}
               <div className="relative">
                    <input
                        type="text"
                        placeholder="Search friends..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input dark:border-input-dark bg-background dark:bg-background-dark rounded-md focus:outline-none focus:ring-1 focus:ring-ring dark:focus:ring-ring-dark text-sm"
                    />
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>

              {/* Filters */}
              <div className="flex space-x-2">
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

              {/* Friends List */}
              <div className="space-y-1 overflow-y-auto max-h-[calc(70vh-150px)] pr-1">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map(friend => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      isSelected={selectedFriendId === friend.id}
                      onClick={handleSelectFriend}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No friends found.</p>
                )}
              </div>
            </div>

            {/* Right Content Area: Friend Details */}
             <div className="relative flex-1">
                 <AnimatePresence>
                    {selectedFriend && (
                      <FriendDetailsPanel
                        key={selectedFriend.id}
                        friend={selectedFriend}
                        onClose={handleCloseDetails}
                      />
                    )}
                 </AnimatePresence>
                 {!selectedFriendId && (
                    <div className="hidden md:flex items-center justify-center h-full text-muted-foreground">
                       <p>Select a friend to view details.</p>
                    </div>
                 )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;
