"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
// Firebase Auth
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // For user authentication state
  const [user, setUser] = useState<User | null>(null);

  // For theme toggling
  const [isDark, setIsDark] = useState(false);

  // Slide-in variants
  const menuVariants = {
    open: {
      x: 0,
      transition: { type: "tween", duration: 0.3 },
    },
    closed: {
      x: "100%", // Offscreen to the right
      transition: { type: "tween", duration: 0.3 },
    },
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // On mount, check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <>
      {/* Hamburger Button positioned on the right */}
      <div className="md:hidden flex justify-end p-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none"
          style={{ color: "var(--foreground)" }}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: "var(--foreground)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: "var(--foreground)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Sliding Mobile Menu from the right */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 w-64 h-full shadow-lg z-50 p-4"
            style={{
              backgroundColor: "var(--neutral)",
              color: "var(--foreground)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="mb-4 focus:outline-none"
              style={{ color: "var(--foreground)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "var(--foreground)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ul className="flex flex-col space-y-4">
              {/* If user is signed in, show Sign Out; otherwise show Login */}
              <li className="text-lg font-medium">
                {user ? (
                  <button
                    className="block hover:underline"
                    onClick={handleSignOut}
                    style={{ color: "var(--foreground)" }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link href="/login" legacyBehavior>
                    <a
                      className="block hover:underline"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ color: "var(--foreground)" }}
                    >
                      Login
                    </a>
                  </Link>
                )}
              </li>
              <li className="text-lg font-medium">
                <Link href="/upload" legacyBehavior>
                  <a
                    className="block hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ color: "var(--foreground)" }}
                  >
                    Upload
                  </a>
                </Link>
              </li>
              <li className="text-lg font-medium">
                <Link href="/timeline" legacyBehavior>
                  <a
                    className="block hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ color: "var(--foreground)" }}
                  >
                    Timeline
                  </a>
                </Link>
              </li>
              {/* Theme Toggle */}
              <li className="text-lg font-medium">
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMenuOpen(false);
                  }}
                  style={{ color: "var(--foreground)" }}
                  className="block hover:underline"
                >
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
