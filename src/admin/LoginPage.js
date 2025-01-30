import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {isAdminLoggedIn, setIsAdminLoggedIn} = useAppContext();

  if (isAdminLoggedIn) {
    navigate("/admin@mere-bankey-bihari");
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    if(email === "admin@gmail.com" && password === "admin"){
        setIsAdminLoggedIn(true);
        sessionStorage.setItem("isAdminLoggedIn", true);
        toast.success("Login successful");
        navigate("/admin@mere-bankey-bihari");
    }else{
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-orange-500 p-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            Admin Login
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-orange-100 mt-2"
          >
            Welcome back! Please sign in to continue.
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all duration-200"
          >
            Sign In
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-gray-50 p-4 text-center"
        >
          <p className="text-sm text-gray-600">
            Forgot your password?{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Reset it here
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;