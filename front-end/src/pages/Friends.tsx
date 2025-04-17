import { useState } from "react";
import Sidebar from "../components/sibebar";
import AuthHeader from "../components/AuthHeader";
import { Plus } from "lucide-react";

export default function Friends() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [friends, setFriends] = useState([]); // Start empty

  const currentTime = () => {
    const hours = new Date().getHours();
    if (hours >= 12 && hours < 18) return "Good Afternoon";
    if (hours >= 18 && hours < 22) return "Good Evening";
    return "Good Morning";
  };

  const handleAddFriend = () => {
    console.log("Add friend clicked");
    const newId = friends.length + 1;
    setFriends([...friends, { id: newId, name: `Friend ${newId}` }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AuthHeader />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="bg-gray-800 rounded-2xl shadow-xl flex overflow-hidden max-w-6xl mx-auto min-h-[600px]">
            {/* Friends list panel */}
            <div className="w-1/2 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Friends</h2>
                  <p className="text-gray-400">{currentTime()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Friend Cards */}
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend.name)}
                    className={`cursor-pointer bg-gray-700 p-4 rounded-lg shadow text-white hover:bg-gray-600 transition ${
                      selectedFriend === friend.name ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <p className="font-semibold">{friend.name}</p>
                    <p className="text-sm text-gray-300">Online</p>
                  </div>
                ))}

                {/* Add Friend Card (always last) */}
                <div
                  onClick={handleAddFriend}
                  className="cursor-pointer bg-gray-700 p-4 rounded-lg shadow text-white hover:bg-gray-600 transition flex items-center justify-center"
                >
                  <Plus className="w-8 h-8 text-gray-300" />
                </div>
              </div>
            </div>

            {/* Chat panel */}
            <div className="w-1/2 p-6 text-white flex flex-col">
              <h2 className="text-2xl font-bold mb-4">Chat</h2>
              <div className="flex-1 bg-gray-700 rounded-lg p-4 mb-4 overflow-y-auto">
                {selectedFriend ? (
                  <p className="text-gray-300">
                    Chatting with <strong>{selectedFriend}</strong>...
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    Select a friend to start chatting.
                  </p>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!message.trim()) return;
                  console.log(`Sending message to ${selectedFriend}:`, message);
                  setMessage("");
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
