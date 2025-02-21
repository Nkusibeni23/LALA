"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ValidationCard from "@/components/ValidationCard";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import api from "@/lib/axios";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RENTER");
  const [error, setError] = useState("");
  const [validationCardVisible, setValidationCardVisible] = useState(false);
  const [validationCardType, setValidationCardType] = useState<
    "success" | "error" | "warning"
  >("success");
  const [validationCardMessage, setValidationCardMessage] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/home",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setValidationCardMessage(error.message);
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      !emailRegex.test(value) ? "Please enter a valid email address." : ""
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setError(
      value.length < 8 ? "Password must be at least 8 characters long." : ""
    );
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (emailError || error) return;

    setIsLoading(true);

    try {
      await api.post("/signup", {
        name,
        email,
        password,
        role,
      });

      setValidationCardType("success");
      setValidationCardMessage("Sign-up successful! Redirecting...");
      setValidationCardVisible(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/auth/sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-700 via-black-500 to-gray-100 p-4">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative w-full max-w-md"
      >
        {validationCardVisible && (
          <motion.div
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ValidationCard
              type={validationCardType}
              message={validationCardMessage}
            />
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="backdrop-blur-lg bg-gray-200 p-8 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
        >
          <motion.header
            variants={staggerChildren}
            className="text-center mb-8"
          >
            <motion.h2 className="text-3xl font-bold text-gray-900 mb-2 transform transition-all duration-300">
              Welcome
            </motion.h2>
            <motion.p variants={fadeIn} className="text-gray-600">
              TO LALA STATE
            </motion.p>
          </motion.header>

          {/* Google Sign-In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold 
              bg-gray-800 hover:bg-gray-900 active:scale-95 hover:shadow-lg transition-all duration-300 ease-out text-gray-100 mb-4"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Continue with Google</span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center justify-center my-4">
            <div className="w-1/4 border-t border-gray-900"></div>
            <span className="mx-4 text-gray-600 text-sm">Or</span>
            <div className="w-1/4 border-t border-gray-900"></div>
          </div>

          <motion.form
            variants={staggerChildren}
            onSubmit={handleSubmit}
            className="space-y-5 cursor-pointer"
          >
            <motion.div variants={fadeIn}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={handleNameChange}
                className="w-full px-4 py-3 rounded-lg bg-transparent border-gray-600 focus:outline-none
                border border-gray-600/80 text-gray-800
                 focus:ring-1 focus:ring-gray-900
                focus:border-transparent transition-all duration-300
                "
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={handleEmailChange}
                className="w-full px-4 py-3 rounded-lg bg-transparent border-gray-600 focus:outline-none
                border border-gray-600/80 text-gray-800
                 focus:ring-1 focus:ring-gray-900
                focus:border-transparent transition-all duration-300
                "
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </motion.div>
            <motion.div variants={fadeIn}>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 rounded-lg bg-transparent border-gray-600 focus:outline-none
                border border-gray-600/80 text-gray-800
                 focus:ring-1 focus:ring-gray-900
                focus:border-transparent transition-all duration-300
                "
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </motion.div>

            <motion.div variants={fadeIn}>
              <select
                value={role}
                onChange={handleRoleChange}
                className="w-full px-4 py-3 rounded-lg bg-transparent border-gray-600 focus:outline-none
                border border-gray-600/80 text-gray-800
                 focus:ring-1 focus:ring-gray-900
                focus:border-transparent transition-all duration-300
                "
              >
                <option value="RENTER">RENTER</option>
                <option value="HOST">HOST</option>
              </select>
            </motion.div>

            <motion.button
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-gray-100 transform transition-all duration-300 ease-out ${
                isLoading
                  ? "bg-gray-700 cursor-wait"
                  : "bg-gray-800 hover:bg-gray-900 active:scale-95 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </motion.form>
          <motion.div variants={fadeIn} className="mt-6 text-center">
            <button
              onClick={() => router.push("/auth/sign-in")}
              className="text-sm text-gray-700"
            >
              Already have an account?{" "}
              <span className="ml-2 text-sm font-bold text-gray-800 hover:text-gray-900 transition-colors duration-300">
                Sign In
              </span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
