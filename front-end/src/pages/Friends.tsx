import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Friends = () => {
  const friends = [
    { name: "Alice Johnson", email: "alice.johnson@example.com", status: "Online" },
    { name: "Bob Smith", email: "bob.smith@example.com", status: "Offline" },
    { name: "Charlie Brown", email: "charlie.brown@example.com", status: "Busy" },
    { name: "Diana Prince", email: "diana.prince@example.com", status: "Online" },
    { name: "Ethan Hunt", email: "ethan.hunt@example.com", status: "Offline" },
    { name: "Fiona Gallagher", email: "fiona.gallagher@example.com", status: "Busy" },
    { name: "George Clooney", email: "george.clooney@example.com", status: "Online" },
    { name: "Hannah Montana", email: "hannah.montana@example.com", status: "Offline" },
    { name: "Ian Somerhalder", email: "ian.somerhalder@example.com", status: "Busy" },
    { name: "Jack Sparrow", email: "jack.sparrow@example.com", status: "Online" },
    { name: "Karen Gillan", email: "karen.gillan@example.com", status: "Offline" },
    { name: "Liam Neeson", email: "liam.neeson@example.com", status: "Busy" },
    { name: "Mia Wallace", email: "mia.wallace@example.com", status: "Online" },
    { name: "Nathan Drake", email: "nathan.drake@example.com", status: "Offline" },
    { name: "Olivia Pope", email: "olivia.pope@example.com", status: "Busy" },
    { name: "Peter Parker", email: "peter.parker@example.com", status: "Online" },
    { name: "Quinn Fabray", email: "quinn.fabray@example.com", status: "Offline" },
    { name: "Rachel Green", email: "rachel.green@example.com", status: "Busy" },
    { name: "Steve Rogers", email: "steve.rogers@example.com", status: "Online" },
    { name: "Tony Stark", email: "tony.stark@example.com", status: "Offline" },
  ];

  const [filter, setFilter] = useState("Online");

  const filteredFriends =
    filter === "All"
      ? [...friends].sort((a, b) => {
          const order: Record<"Online" | "Busy" | "Offline", number> = {
            Online: 0,
            Busy: 1,
            Offline: 2,
          };
          return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
        })
      : friends.filter((f) => f.status === filter);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const statusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold";
    if (status === "Online")
      return `${base} bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100`;
    if (status === "Busy")
      return `${base} bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100`;
    return `${base} bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-gray-900 dark:text-white">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Friends</h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkAccent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 font-medium"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Busy">Busy</option>
            <option value="All">All</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredFriends.map((friend) => (
              <motion.div
                key={friend.email}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="bg-white/90 dark:bg-darkCard rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
              >
                <h2 className="text-lg font-semibold text-violet-800 dark:text-lavenderAccent mb-1">
                  {friend.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {friend.email}
                </p>
                <span className={statusBadge(friend.status)}>{friend.status}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Friends;
