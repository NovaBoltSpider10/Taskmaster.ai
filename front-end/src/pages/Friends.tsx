const Friends = () => {
    // Mock data for friends
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
  
    return (
      <div className="flex w-full h-full">
        {/* Main content */}
        <div className="w-3/4 p-6 space-y-6">
          {/* Friends Section */}
          <div>
            <h1 className="text-2xl font-bold mb-4">Friends</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map((friend, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                >
                  <h2 className="text-lg font-semibold">{friend.name}</h2>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {friend.email}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      friend.status === "Online"
                        ? "text-green-600"
                        : friend.status === "Busy"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    <strong>Status:</strong> {friend.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Friends;