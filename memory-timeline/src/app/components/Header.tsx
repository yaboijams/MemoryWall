"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar"; // Make sure this file exists
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className="p-4 shadow-md"
      style={{
        background: "linear-gradient(90deg, var(--primary), var(--secondary))",
        color: "var(--foreground)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" legacyBehavior>
          <a>
            <h1 className="text-3xl font-bold">Memory Timeline</h1>
          </a>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            {user ? (
              <li className="text-lg font-medium">
                <button onClick={handleSignOut} className="hover:underline">
                  Sign Out
                </button>
              </li>
            ) : (
              <li className="text-lg font-medium">
                <Link href="/login" legacyBehavior>
                  <a className="hover:underline">Login</a>
                </Link>
              </li>
            )}
            <li className="text-lg font-medium">
              <Link href="/upload" legacyBehavior>
                <a className="hover:underline">Upload</a>
              </Link>
            </li>
            <li className="text-lg font-medium">
              <Link href="/timeline" legacyBehavior>
                <a className="hover:underline">Timeline</a>
              </Link>
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {isDark ? (
                  // Sun icon (when dark, clicking switches to light mode)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.354a1 1 0 011 1v1.292a1 1 0 11-2 0V5.354a1 1 0 011-1zm5.657 2.343a1 1 0 010 1.414l-.916.917a1 1 0 11-1.414-1.414l.917-.917a1 1 0 011.413 0zM20 11a1 1 0 110 2h-1.292a1 1 0 110-2H20zM17.657 16.314a1 1 0 01-1.414 0l-.917-.917a1 1 0 011.414-1.414l.917.917a1 1 0 010 1.414zM12 17.354a1 1 0 011 1v1.292a1 1 0 11-2 0v-1.292a1 1 0 011-1zm-5.657-1.04a1 1 0 010-1.414l.917-.917a1 1 0 011.414 1.414l-.917.917a1 1 0 01-1.414 0zM4 11a1 1 0 110 2H2.708a1 1 0 110-2H4zm2.343-4.657a1 1 0 011.414 0l.917.917a1 1 0 11-1.414 1.414l-.917-.917a1 1 0 010-1.414z" />
                    <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  // Moon icon (when light, clicking switches to dark mode)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </li>
          </ul>
        </nav>
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          {user ? (
            <button
              onClick={handleSignOut}
              className="px-3 py-1 rounded bg-red-500 text-white mr-4"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-4"
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4.354a1 1 0 011 1v1.292a1 1 0 11-2 0V5.354a1 1 0 011-1zm5.657 2.343a1 1 0 010 1.414l-.916.917a1 1 0 11-1.414-1.414l.917-.917a1 1 0 011.413 0zM20 11a1 1 0 110 2h-1.292a1 1 0 110-2H20zM17.657 16.314a1 1 0 01-1.414 0l-.917-.917a1 1 0 011.414-1.414l.917.917a1 1 0 010 1.414zM12 17.354a1 1 0 011 1v1.292a1 1 0 11-2 0v-1.292a1 1 0 011-1zm-5.657-1.04a1 1 0 010-1.414l.917-.917a1 1 0 011.414 1.414l-.917.917a1 1 0 01-1.414 0zM4 11a1 1 0 110 2H2.708a1 1 0 110-2H4zm2.343-4.657a1 1 0 011.414 0l.917.917a1 1 0 11-1.414 1.414l-.917-.917a1 1 0 010-1.414z" />
                  <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          )}
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
}
