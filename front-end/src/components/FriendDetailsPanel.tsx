import React, { useState, useEffect } from 'react';
// Removed motion import as animation wrapper is gone
// import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

// Define a type for message objects
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'friend'; // Add 'friend' as a possible sender
  timestamp?: Date; // Optional timestamp
}

interface Friend {
  id: string;
  username: string;
  // Other fields might still be needed depending on context, keep them for now
  isOnline: boolean;
  commonCourses: string[];
  notes?: string;
  streak?: number;
  xpAvailable?: boolean;
}

interface ChatInterfaceProps {
  friend: Friend | null;
  // Remove allFriends and dropdown selection props
}

// Dummy conversation with Alice
const ALICE_CONVERSATION: ChatMessage[] = [
  {
    id: '1',
    text: "Hey Alice! How's the Quantum Physics homework coming along?",
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '2',
    text: "Ugh, it's killing me! Those Schrödinger equations are impossible 😩",
    sender: 'friend',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9) // 1.9 hours ago
  },
  {
    id: '3',
    text: "I'm stuck on problem 3. Have you figured that one out yet?",
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8) // 1.8 hours ago
  },
  {
    id: '4',
    text: "Yeah, that's the tricky one with the wave function collapse. The key is to remember that the observer affects the outcome. Want to study together at the library tomorrow?",
    sender: 'friend',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7) // 1.7 hours ago
  },
  {
    id: '5',
    text: "That would be great! How about 3pm at the usual spot?",
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.6) // 1.6 hours ago
  },
  {
    id: '6',
    text: "Perfect! I'll bring my notes and some coffee. Don't forget to bring the textbook this time! 😄",
    sender: 'friend',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5) // 1.5 hours ago
  }
];

// Rename component conceptually, keep filename for now
const FriendDetailsPanel: React.FC<ChatInterfaceProps> = ({ friend }) => {
  // Removed notes state and editing logic
  // const [notes, setNotes] = useState(friend.notes || '');
  // const [isEditingNotes, setIsEditingNotes] = useState(false);
  const { isPersonalityComplete } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]); // State for chat history

  // Initialize with dummy conversation if friend is Alice
  useEffect(() => {
    setMessage('');
    
    // Reset messages when friend changes
    if (friend?.username === "AliceWonder") {
      setMessages([...ALICE_CONVERSATION]);
    } else {
      setMessages([]);
    }
  }, [friend?.id]);

  // Removed unused handlers
  // const handleRequestContactInfo = () => { ... };
  // const handleEditNotes = () => { ... };
  // const handleSaveNotes = () => { ... };
  // const handleRedeemStreakXP = () => { ... };

  const handleSendMessage = () => {
    // Only send if a friend is selected and personality is complete
    if (message.trim() && friend && isPersonalityComplete) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
      
      // For Alice, add an automatic reply after a short delay
      if (friend.username === "AliceWonder") {
        setTimeout(() => {
          const replies = [
            "That's really interesting! Tell me more.",
            "I see what you mean. BTW, don't forget we have that Creative Writing assignment due on Friday.",
            "Haha, that's funny! 😂",
            "Hmm, I'm not sure about that. Let me check my notes and get back to you.",
            "Speaking of which, are you going to the study group this weekend?",
            "Great! I think Professor Johnson would agree with that."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          
          const replyMessage: ChatMessage = {
            id: Date.now().toString(),
            text: randomReply,
            sender: 'friend',
            timestamp: new Date()
          };
          
          setMessages(prevMessages => [...prevMessages, replyMessage]);
        }, 1000); // Reply after 1 second
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Format timestamp if available
  const formatTime = (timestamp?: Date) => {
    if (!timestamp) return '';
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Simple Chat Header - No dropdown functionality */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        {friend ? (
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-emphasis">{friend.username}</h2>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${friend.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {friend.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-muted-foreground">Select a friend to chat with</h2>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
        {/* Only show chat content if a friend is selected */}
        {friend ? (
            <>
              {/* Message list */}
              <div className="flex-grow bg-muted/30 rounded-md p-3 overflow-y-auto border border-input flex flex-col space-y-2 min-h-[200px]">
                {messages.length === 0 && (
                  <div className="text-sm text-muted-foreground italic p-2 rounded w-fit self-center">
                    No messages yet with {friend.username}.
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg text-sm max-w-[75%] ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground self-end' 
                        : 'bg-background text-foreground self-start'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.timestamp && (
                      <div className={`text-xs mt-1 ${
                        msg.sender === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Message Input Area */}
              <div className="flex space-x-2 mt-auto">
                <input
                  type="text"
                  placeholder={`Message ${friend.username}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm"
                  disabled={!isPersonalityComplete}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!message.trim() || !isPersonalityComplete}
                >
                  Send
                </button>
              </div>
            </>
          ) :  (
          // Placeholder when no chat target is selected
          <div className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">Select a friend from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendDetailsPanel; 