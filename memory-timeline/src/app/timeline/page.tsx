"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";

interface Memory {
  id: string;
  title?: string;      // Optional title field
  caption?: string;    // Optional caption field
  date: any;           // Firestore Timestamp field
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

export default function Timeline() {
  const [memories, setMemories] = useState<Memory[]>([]);

  // Fetch memories from Firestore from the "MemoryWall" collection
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
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>
        Your Memory Timeline
      </h2>
      {memories.length === 0 ? (
        <p className="text-center" style={{ color: "var(--foreground)" }}>
          No memories found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-auto">
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 shadow-xl"
              style={{
                transform: `rotate(${getRotationAngle(memory.id)}deg)`,
                border: "2px solid white",
                borderRadius: "0.5rem",
              }}
            >
              <p className="text-sm mb-2" style={{ color: "var(--foreground)" }}>
                {new Date(memory.date?.seconds * 1000).toLocaleDateString()}
              </p>
              {memory.imageUrl && (
                <img
                  src={memory.imageUrl}
                  alt="Memory"
                  className="w-full rounded mb-2"
                />
              )}
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
                style={{ color: "var(--foreground)" }}
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
