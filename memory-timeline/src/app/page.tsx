"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// Extend Memory interface with an optional description field
interface Memory {
  id: string;
  caption: string;
  date: any; // Alternatively, use Firestore's Timestamp type
  imageUrl?: string;
  description?: string;
}

/**
 * Returns a deterministic rotation angle (in degrees) based on a string key.
 * This produces a number between -3 and 3.
 */
function getRotationAngle(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (Math.abs(hash) % 7) - 3; // Range: -3 to 3 degrees
}

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([]);
  
  // Preview slider images (example URLs)
  const previewImages = [
    "https://wallpapersok.com/images/hd/winking-cute-girl-shen9t2b3lrcv8he.jpg",
    "https://i.redd.it/cute-girl-drawing-reference-is-from-pinterest-also-my-v0-h95tudnrceaa1.jpg?width=736&format=pjpg&auto=webp&s=80f60748b160faa32ef449bb6d35ad61209fcef8",
    "https://photoshulk.com/wp-content/uploads/Cute-Girl-Adventure-Photo.jpg",
  ];
  const [previewIndex, setPreviewIndex] = useState(0);

  // Cycle through preview images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewIndex((prevIndex) => (prevIndex + 1) % previewImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [previewImages.length]);

  // Fetch memories from Firestore (most recent 5)
  useEffect(() => {
    async function fetchMemories() {
      try {
        const memoriesQuery = query(
          collection(db, "memories"),
          orderBy("date", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(memoriesQuery);
        const fetchedMemories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Memory[];
        setMemories(fetchedMemories);
      } catch (error) {
        console.error("Error fetching memories: ", error);
      }
    }
    fetchMemories();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 px-4 py-8">
      {/* Page Heading */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold"
        style={{ color: "var(--primary)" }}
      >
        Welcome to Memory Timeline
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl"
        style={{ color: "var(--foreground)" }}
      >
        Store and relive your most cherished memories.
      </motion.p>

      {/* Preview Slider with Polaroid Style */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={previewImages[previewIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 shadow-xl inline-block"
            style={{ transform: `rotate(${getRotationAngle(previewImages[previewIndex])}deg)` }}
          >
            <img
              src={previewImages[previewIndex]}
              alt="Memory Preview"
              className="w-full rounded"
            />
            {/* Description area for the preview slider */}
            <div className="mt-2 text-center text-sm italic" style={{ color: "var(--foreground)" }}>
              A glimpse into precious moments.
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Memory Cards */}
      <div className="w-full max-w-4xl">
        <AnimatePresence>
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="shadow-lg mb-4 p-4 rounded"
              style={{ backgroundColor: "var(--neutral)" }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  {memory.caption}
                </h3>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>
                  {new Date(memory.date?.seconds * 1000).toLocaleDateString()}
                </p>
                {/* Polaroid Image Wrapper with variable rotation */}
                <div className="mt-2 inline-block">
                  {memory.imageUrl ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white p-4 shadow-xl inline-block"
                      style={{ transform: `rotate(${getRotationAngle(memory.id)}deg)` }}
                    >
                      <img
                        src={memory.imageUrl}
                        alt="Memory Preview"
                        className="w-full rounded"
                      />
                      {/* Space for description or thoughtful text */}
                      <div className="mt-2 text-center text-sm italic" style={{ color: "var(--foreground)" }}>
                        {memory.description || "A treasured memory."}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white p-4 shadow-xl inline-block"
                      style={{ transform: `rotate(${getRotationAngle(memory.id)}deg)` }}
                    >
                      <img
                        src="/preview-placeholder.jpg"
                        alt="Preview Placeholder"
                        className="w-full rounded"
                      />
                      <div className="mt-2 text-center text-sm italic" style={{ color: "var(--foreground)" }}>
                        A treasured memory.
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Link to Full Timeline */}
      <Link href="/timeline">
        <button
          className="btn"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
          }}
        >
          View Full Timeline
        </button>
      </Link>
    </div>
  );
}
