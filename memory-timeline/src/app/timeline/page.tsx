"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { motion } from "framer-motion";

interface Memory {
  id: string;
  caption: string;
  date: any; // Alternatively, use Firestore's Timestamp type
  imageUrl?: string;
  description?: string;
}

/**
 * Returns a deterministic rotation angle (in degrees) based on a string key.
 * The value will be between -3 and 3 degrees.
 */
function getRotationAngle(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (Math.abs(hash) % 7) - 3; // Range: -3 to 3 degrees
}

/**
 * Checks if the provided URL (ignoring query parameters) ends with a valid image extension.
 */
function isValidImage(url: string): boolean {
  const validExtensions = [".jpeg", ".jpg", ".gif", ".png"];
  const baseUrl = url.split('?')[0].toLowerCase();
  return validExtensions.some((ext) => baseUrl.endsWith(ext));
}

// Default sample photos (in case fetching from Storage fails)
const defaultSamplePhotos = [
  "https://wallpapersok.com/images/hd/winking-cute-girl-shen9t2b3lrcv8he.jpg",
  "https://i.redd.it/cute-girl-drawing-reference-is-from-pinterest-also-my-v0-h95tudnrceaa1.jpg?width=736&format=pjpg&auto=webp&s=80f60748b160faa32ef449bb6d35ad61209fcef8",
  "https://photoshulk.com/wp-content/uploads/Cute-Girl-Adventure-Photo.jpg",
];

export default function Timeline() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [fallbackPhotos, setFallbackPhotos] = useState<string[]>([]);

  // Fetch memories from Firestore
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

  // Fetch fallback photos from Firebase Storage ("n1", "n2", "n3")
  useEffect(() => {
    async function fetchFallbackPhotos() {
      try {
        const photoNames = ["n1", "n2", "n3"];
        const urls = await Promise.all(
          photoNames.map((name) => getDownloadURL(ref(storage, name)))
        );
        setFallbackPhotos(urls);
      } catch (error) {
        console.error("Error fetching fallback photos:", error);
        // Fallback to default sample photos if error occurs
        setFallbackPhotos(defaultSamplePhotos);
      }
    }
    fetchFallbackPhotos();
  }, []);

  // If no memories are fetched, build fallback cards from fallbackPhotos
  const displayCards =
    memories.length > 0
      ? memories
      : fallbackPhotos.length > 0
      ? fallbackPhotos.map((url, index) => ({
          id: `sample-${index}`,
          caption: "Sample Memory Caption",
          date: { seconds: Date.now() / 1000 },
          imageUrl: url,
          description: "A treasured memory.",
        }))
      : defaultSamplePhotos.map((url, index) => ({
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
          // Determine which URL to use: if memory.imageUrl exists and is valid, use it; otherwise use a fallback.
          const photoUrl =
            memory.imageUrl && isValidImage(memory.imageUrl)
              ? memory.imageUrl
              : fallbackPhotos.length > 0
              ? fallbackPhotos[index % fallbackPhotos.length]
              : defaultSamplePhotos[index % defaultSamplePhotos.length];

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
