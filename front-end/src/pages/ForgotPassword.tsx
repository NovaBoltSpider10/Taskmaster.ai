import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import NavBar from "../components/navbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (res.ok) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <NavBar />
      <div className="relative h-screen flex items-center justify-center bg-skyLightest dark:bg-darkBg px-4 py-8">
        <AnimatedBackground />
        <div className="w-[480px] bg-white dark:bg-darkCard shadow-lg rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Reset Password</h2>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                className="w-full p-2 rounded-md border dark:bg-darkAccent text-black dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                className="w-full p-2 rounded-md border dark:bg-darkAccent text-black dark:text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
