"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import Image from "next/image";

interface Memory {
  id: string;
  title?: string;      // Optional title field
  caption?: string;    // Optional caption field
  date: Timestamp;     // Firestore Timestamp field
  imageUrl?: string;   // Field for both images and videos
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
  return (Math.abs(hash) % 7) - 3;
}

/** Checks if the file extension is a video type (naive check) */
function isVideoFile(url: string): boolean {
  return /\.(mp4|mov|webm|ogg)$/i.test(url);
}

export default function Timeline() {
  const [memories, setMemories] = useState<Memory[]>([]);

  // Fetch memories from Firestore
  useEffect(() => {
    async function fetchMemories() {
      try {
        const q = query(collection(db, "MemoryWall"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Memory[];
        console.log("Fetched memories:", data);
        setMemories(data);
      } catch (error) {
        console.error("Error fetching memories:", error);
      }
    }
    fetchMemories();
  }, []);

  return (
    <div className="p-4">
      {/* Sweet Message Heading */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--primary)" }}>
          My Beautiful Headache
        </h2>
        <p className="italic text-lg" style={{ color: "var(--foreground)" }}>
          Nyah, I still remember that Valentine&apos;s Day when you asked
          about my earring while I was tabling for TKE. Ever since then, our
          bond has grown deeper, and every memory with you is a treasure. I
          built this app as a token of my appreciation for you and for all the
          memories we have yet to create together.
          <br />
          <br />
          P.S. Only we have access to this special space.
        </p>
      </div>

      {memories.length === 0 ? (
        <p className="text-center" style={{ color: "var(--foreground)" }}>
          No memories found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-auto">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 shadow-xl"
              style={{
                transform: `rotate(${getRotationAngle(memory.id)}deg)`,
                border: "2px solid white",
                borderRadius: "0.5rem",
              }}
            >
              <p className="text-sm mb-2" style={{ color: "var(--text)" }}>
                {new Date(memory.date.seconds * 1000).toLocaleDateString()}
              </p>
              {/* Display either a video or an image */}
              {memory.imageUrl && isVideoFile(memory.imageUrl) ? (
                <video
                  src={memory.imageUrl}
                  controls
                  className="w-full h-64 object-contain rounded mb-2"
                />
              ) : memory.imageUrl ? (
                <Image
                  src={memory.imageUrl}
                  alt="Memory"
                  width={600}
                  height={256}
                  className="rounded mb-2 object-contain"
                />
              ) : null}

              {memory.title && (
                <p
                  className="text-xl font-bold text-center"
                  style={{ color: "var(--primary)" }}
                >
                  {memory.title}
                </p>
              )}
              <div
                className="mt-2 text-center text-sm italic"
                style={{ color: "var(--text)" }}
              >
                {memory.caption || "A treasured memory."}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
