import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(9, "Password must be at least 9 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [setInvalidPass, setSetInvalidPass] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    await axios
      .post("http://localhost:3000/auth", data)
      .then((response) => {
        const token = response.data;
        if (token) {
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } else {
          console.error("No token received from server");
        }
      })
      .catch((error) => {
        console.error(
          "Login error: ",
          error.response?.data?.message || error.message
        );
        setSetInvalidPass(true);
      });
  };

  return (
    <>
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 overflow-hidden">
        {/* SVG Background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 600"
        >
          <g fill="none" stroke="white" strokeWidth="0.5">
            <circle cx="400" cy="300" r="200" />
            <circle cx="400" cy="300" r="300" />
            <circle cx="400" cy="300" r="400" />
          </g>
        </svg>

        {/* Animated Blobs */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 top-[-4rem] left-[-3rem] z-[-1]"
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 top-[6rem] right-[6rem] z-[-1]"
          animate={{
            x: [0, -20, 20, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-[480px] bg-white shadow-lg rounded-lg p-8 space-y-6 z-10 relative"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>
          {setInvalidPass && (
            <p className="text-red-500 text-sm mt-2">
              Invalid email or password
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign In
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center mt-4"
            >
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
    </>
  );
}

export default Login;