import Greeting from "../components/Greeting";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md z-10">
      <div className="px-4 py-4 flex items-center justify-between h-20 border-b">
        <h1 className="text-2xl font-bold text-gray-800">TaskMasterAI</h1>

        <div className="animate-fade flex-1 flex justify-center items-center">
          <Greeting />
        </div>

        <nav className="flex space-x-6">
          <a href="/" className="text-gray-600 hover:text-gray-900 transition">
            Home
          </a>
          <a
            href="/login"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
