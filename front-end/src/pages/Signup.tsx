import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/navbar";
import AnimatedBackground from "../components/AnimatedBackground";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    email: '',
    password: '', // Keep password if needed, or adjust requirements
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    email: '',
    password: '', // Add password error state if needed
  });

  const navigate = useNavigate();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        return value.trim() === '' ? 'First name is required' : '';
      case 'lastName':
        return value.trim() === '' ? 'Last name is required' : '';
      case 'username':
        if (value.trim() === '') return 'Username is required';
        if (value.trim().length < 3) return 'Username must be at least 3 characters';
        return '';
      case 'dob':
        return value === '' ? 'Date of birth is required' : '';
      case 'email':
        if (value.trim() === '') return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Invalid email format' : '';
      case 'password': // Add password validation if required by original design
         if (value.trim() === '') return 'Password is required';
         // Add other password rules if necessary (length, complexity)
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change after initial interaction
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate all fields on submit
    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      username: validateField('username', formData.username),
      dob: validateField('dob', formData.dob),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password), // Validate password
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === '');

    if (isValid) {
      console.log("Sign up attempted", formData);
      // Keep existing navigation or update as needed
      navigate("/login"); // Or maybe navigate to a different page on successful sign up
    } else {
       console.log('Form validation failed:', newErrors);
    }
  };

  // Updated input class for modern styling
  const inputClass = `w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-darkAccent text-[#2a2a2a] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const errorClass = `text-red-500 text-xs mt-1`;


  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col bg-[#fdfaf5] dark:bg-darkBg transition-colors duration-500">
        <AnimatedBackground />
        <div className="flex-grow flex items-center justify-center px-4 overflow-y-auto py-8">
          <div className="w-full max-w-md bg-white dark:bg-darkCard rounded-2xl shadow-md p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#2a2a2a] dark:text-white">Create Account</h2>
              <p className="text-gray-500 dark:text-gray-300 mt-2">Sign up to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#2a2a2a] dark:text-gray-200 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#2a2a2a] dark:text-gray-200 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#2a2a2a] dark:text-gray-200 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass}
                  placeholder="Choose a username (min. 3 chars)"
                />
                {errors.username && <p className={errorClass}>{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-[#2a2a2a] dark:text-gray-200 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass}
                />
                {errors.dob && <p className={errorClass}>{errors.dob}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2a2a2a] dark:text-gray-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#2a2a2a] dark:text-gray-200 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass}
                  placeholder="Create a password"
                />
                {errors.password && <p className={errorClass}>{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Sign Up
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-[#5a5a5a] dark:text-gray-300">
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
