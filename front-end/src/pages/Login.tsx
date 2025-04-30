import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import NavBar from "../components/navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Login request payload:", { email, password });
      const response = await fetch("http://localhost:3000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        login(token);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          navigate("/dashboard");
        }, 3000);
      } else {
        alert("Invalid credentials!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <NavBar />
      <div className="relative h-screen flex items-center justify-center bg-skyLightest dark:bg-darkBg px-4 py-8 overflow-hidden">
        <AnimatedBackground />

        <AnimatePresence>
          {showSuccess && (
            <>
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={300}
                gravity={0.3}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.5 }}
                className="fixed top-16 mx-auto bg-purple-500 dark:bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold text-lg z-50"
              >
                Login Successful!
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="w-[480px] bg-white dark:bg-darkCard shadow-2xl rounded-lg p-8 space-y-6 relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mt-2">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-darkAccent text-black dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-darkAccent text-black dark:text-white"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md transition duration-300 font-bold"
            >
              Sign In
            </button>

            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
