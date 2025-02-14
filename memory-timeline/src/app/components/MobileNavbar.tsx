"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update variants to slide in from the right
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

  return (
    <>
      {/* Hamburger Button positioned on the right */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
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
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4"
          >
            <button onClick={() => setIsMenuOpen(false)} className="mb-4 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ul className="flex flex-col space-y-4">
              <li className="text-lg font-medium">
                <Link href="/login" legacyBehavior>
                  <a className="block hover:underline" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </a>
                </Link>
              </li>
              <li className="text-lg font-medium">
                <Link href="/upload" legacyBehavior>
                  <a className="block hover:underline" onClick={() => setIsMenuOpen(false)}>
                    Upload
                  </a>
                </Link>
              </li>
              <li className="text-lg font-medium">
                <Link href="/timeline" legacyBehavior>
                  <a className="block hover:underline" onClick={() => setIsMenuOpen(false)}>
                    Timeline
                  </a>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
