export default function AuthHeader() {
  const hours = new Date().getHours();

  let greeting = "Good Morning";
  if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
  else if (hours >= 18 && hours < 22) greeting = "Good Evening";

  return (
    <header className="w-full bg-gray-800 text-white shadow-md z-50">
      <div className="px-6 py-4 flex items-center justify-between h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Taskmaster.AI</h1>

        <div className="animate-fade text-sm sm:text-base md:text-lg font-semibold text-gray-200">
          {greeting}, User! :D
        </div>

        <nav className="flex space-x-6 text-sm">
          <a href="/dashboard" className="hover:text-blue-400 transition">
            Dashboard
          </a>
          <a href="/profile" className="hover:text-blue-400 transition">
            Profile
          </a>
          <a href="/" className="hover:text-red-400 transition">
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
}
