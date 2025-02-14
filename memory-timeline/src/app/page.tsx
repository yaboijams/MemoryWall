"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";
import Image from "next/image";

interface Memory {
  id: string;
  caption: string;
  date: Timestamp; // Firestore Timestamp field
  imageUrl?: string;
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
  const [previewIndex, setPreviewIndex] = useState(0);

  // Cycle through preview images every 3 seconds using the memories array
  useEffect(() => {
    if (memories.length > 0) {
      const interval = setInterval(() => {
        setPreviewIndex((prevIndex) => (prevIndex + 1) % memories.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [memories]);

  // Fetch memories from Firestore (most recent 5)
  useEffect(() => {
    async function fetchMemories() {
      try {
        const memoriesQuery = query(
          collection(db, "MemoryWall"),
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
        className="text-3xl font-bold text-center"
        style={{ color: "var(--primary)" }}
      >
        Welcome to Our Memories / Shared moments / Stuff you wanna share with me lol
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl text-center"
        style={{ color: "var(--foreground)" }}
      >
        A safe space to put whatever we want for each other&apos;s eyes. It&apos;s encrypted and private 😉. + We&apos;ll be the only two who ever have access.
      </motion.p>

      {/* Preview Slider with Polaroid Style using Firebase memories */}
      {memories.length > 0 && memories[previewIndex].imageUrl && (
        <div className="w-full max-w-3xl h-[500px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={memories[previewIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-4 shadow-xl inline-block"
              style={{
                transform: `rotate(${getRotationAngle(memories[previewIndex].id)}deg)`,
              }}
            >
              <Image
                src={memories[previewIndex].imageUrl}
                alt="Memory Preview"
                width={300} // adjust as needed
                height={250} // adjust as needed
                className="rounded object-contain"
              />
              {/* Description area for the preview slider */}
              {/* <div
                className="mt-2 text-center text-sm italic"
                style={{ color: "var(--text)" }}
              >
                {memories[previewIndex].caption}
              </div> */}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Link to Full Timeline */}
      <div className="mt-8 text-center">
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
    </div>
  );
}
