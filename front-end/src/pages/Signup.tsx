import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/navbar";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sign up attempted", { email, password });
    navigate("/login");
  };

  return (
    <>
      <NavBar />
      <div className="h-screen flex flex-col bg-skyLightest dark:bg-darkBg transition-colors duration-500">
        <div className="flex-grow flex items-center justify-center px-4 overflow-y-auto py-8">
          <div className="w-[480px] bg-white dark:bg-darkCard shadow-md rounded-lg p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h2>
              <p className="text-gray-500 dark:text-gray-300 mt-2">Sign up to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-darkAccent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-darkAccent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Sign Up
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
