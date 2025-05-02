import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FriendCard from '../components/FriendCard';
import FriendDetailsPanel from '../components/FriendDetailsPanel';
import FriendInfoOverlay from '../components/FriendInfoOverlay';
import { useUser } from '../context/UserContext';

// Define personality profile type
interface PersonalityProfile {
  personality: number;        // 0 to 1
  preferred_time: number;     // 1 = Morning, 2 = Afternoon, 3 = Evening
  in_person: number;          // 0 = Virtual, 1 = In Person
  private_space: number;      // 0 = Public, 1 = Private
}

interface Friend {
  id: string;
  username: string;
  isOnline: boolean;
  commonCourses: string[];
  notes?: string;
  streak?: number;
  xpAvailable?: boolean;
  matched?: boolean;
  personalityProfile: PersonalityProfile;
}

const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    username: 'AliceWonder',
    isOnline: true,
    commonCourses: ['Quantum Physics'],
    personalityProfile: { personality: 0.7, preferred_time: 2, in_person: 1, private_space: 0 },
  },
  {
    id: '2',
    username: 'BobTheBuilder',
    isOnline: false,
    commonCourses: ['Engineering'],
    personalityProfile: { personality: 0.2, preferred_time: 1, in_person: 0, private_space: 0 },
  },
  {
    id: '3',
    username: 'CharlieChap',
    isOnline: true,
    commonCourses: ['Film History'],
    personalityProfile: { personality: 0.5, preferred_time: 3, in_person: 1, private_space: 1 },
  },
  {
    id: '4',
    username: 'DianaPrince',
    isOnline: false,
    commonCourses: ['Ancient History', 'Combat Training'],
    personalityProfile: { personality: 0.6, preferred_time: 2, in_person: 1, private_space: 1 },
  },
  {
    id: '5',
    username: 'EthanHunt',
    isOnline: true,
    commonCourses: ['Espionage Techniques'],
    personalityProfile: { personality: 0.3, preferred_time: 3, in_person: 0, private_space: 0 },
  },
  {
    id: '6',
    username: 'FionaApple',
    isOnline: true,
    commonCourses: ['Music Theory', 'Poetry'],
    personalityProfile: { personality: 0.8, preferred_time: 1, in_person: 1, private_space: 1 },
  },
  {
    id: '7',
    username: 'GeorgeCostanza',
    isOnline: false,
    commonCourses: ['Architecture (Failed)', 'Marine Biology (Claimed)'],
    personalityProfile: { personality: 0.1, preferred_time: 2, in_person: 0, private_space: 0 },
  },
];

const FriendsPage: React.FC = () => {
  const { personalityData } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'matched'>('all');
  const [overlayFriendId, setOverlayFriendId] = useState<string | null>(null);
  const [chatTargetFriendId, setChatTargetFriendId] = useState<string | null>(null);

  useEffect(() => {
    if (!personalityData) {
      setFriends(MOCK_FRIENDS);
      return;
    }

    const userProfile = {
      personality: personalityData.introversionExtroversion / 100,
      preferred_time:
        personalityData.preferredTime === 'Morning' ? 1 :
        personalityData.preferredTime === 'Afternoon' ? 2 :
        personalityData.preferredTime === 'Evening' ? 3 : 0,
      in_person: personalityData.interactionType === 'In Person' ? 1 : 0,
      private_space: personalityData.preferredSpace === 'Private' ? 1 : 0,
    };

    const scoredFriends = MOCK_FRIENDS.map(friend => {
      const f = friend.personalityProfile;
      const distance = Math.sqrt(
        Math.pow(f.personality - userProfile.personality, 2) +
        Math.pow(f.preferred_time - userProfile.preferred_time, 2) +
        Math.pow(f.in_person - userProfile.in_person, 2) +
        Math.pow(f.private_space - userProfile.private_space, 2)
      );

      return {
        ...friend,
        matched: friend.isOnline && distance < 2.2,
      };
    });

    setFriends(scoredFriends);
  }, [personalityData]);

  const filteredFriends = useMemo(() => {
    return friends
      .filter(friend => {
        if (filter === 'online') return friend.isOnline;
        if (filter === 'offline') return !friend.isOnline;
        if (filter === 'matched') return friend.matched;
        return true;
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

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emphasis mb-6">Friends</h1>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="flex h-full">
            <div className="w-full md:w-1/3 border-r border-border p-4">
              <input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded-md text-sm"
              />
              <div className="flex gap-2 mb-4">
                {(['all', 'online', 'offline', 'matched'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      filter === type
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <div className="space-y-2 overflow-y-auto">
                {filteredFriends.map(friend => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    isSelected={overlayFriendId === friend.id}
                    onClick={() => setOverlayFriendId(friend.id)}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <FriendDetailsPanel friend={chatTargetFriend} />
            </div>
          </div>
          <AnimatePresence>
            {overlayFriend && (
              <FriendInfoOverlay
                friend={overlayFriend}
                onClose={() => setOverlayFriendId(null)}
                onMessageButtonClick={(id) => setChatTargetFriendId(id)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;