"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";

interface Memory {
  id: string;
  caption: string;
  date: any; // Alternatively, use Firestore's Timestamp type
  imageUrl?: string;
  description?: string;
}

/**
 * Returns a deterministic rotation angle based on a string key.
 * The value will be between -7.5 and 7.5 degrees.
 */
function getRotationAngle(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (Math.abs(hash) % 15) - 7.5;
}

// Sample photos to use if a memory doesn't include one
const samplePhotos = [
  "https://wallpapersok.com/images/hd/winking-cute-girl-shen9t2b3lrcv8he.jpg",
  "https://i.redd.it/cute-girl-drawing-reference-is-from-pinterest-also-my-v0-h95tudnrceaa1.jpg?width=736&format=pjpg&auto=webp&s=80f60748b160faa32ef449bb6d35ad61209fcef8",
  "https://photoshulk.com/wp-content/uploads/Cute-Girl-Adventure-Photo.jpg",
];

export default function Timeline() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    async function fetchMemories() {
      try {
        const q = query(collection(db, "memories"), orderBy("date", "asc"));
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

  // If no memories are fetched, use sample photos for testing
  const displayCards = memories.length > 0 
    ? memories 
    : samplePhotos.map((url, index) => ({
        id: `sample-${index}`,
        caption: "Sample Memory Caption",
        date: { seconds: Date.now() / 1000 },
        imageUrl: url,
        description: "A treasured memory.",
      }));

  return (
    <div className="p-4">
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--primary)" }}
      >
        Your Memory Timeline
      </h2>
      {/* Responsive grid layout for the Polaroid-style cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayCards.map((memory, index) => {
          // Use memory.imageUrl if available, otherwise choose a sample photo (based on index)
          const photoUrl = memory.imageUrl || samplePhotos[index % samplePhotos.length];
          return (
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
              <img
                src={photoUrl}
                alt="Memory"
                className="w-full rounded mb-2"
              />
              <p
                className="text-base font-semibold"
                style={{ color: "var(--primary)" }}
              >
                {memory.caption}
              </p>
              <div
                className="mt-2 text-center text-sm italic"
                style={{ color: "var(--foreground)" }}
              >
                {memory.description || "A treasured memory."}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
