"use client";

import { useState } from "react";
import { db, storage } from "@/firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function MemoryForm() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting memory form...");
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        console.log("Uploading file:", imageFile.name);

        // We always store in the "images" folder (GIF included)
        const storageRef = ref(
          storage,
          `images/${imageFile.name}_${Date.now()}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        console.log("Image uploaded, snapshot:", snapshot);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Retrieved image URL:", imageUrl);
      } else {
        console.log("No image file provided.");
      }

      // Ensure date is valid
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date provided.");
      }

      const payload = {
        title,
        caption,
        date: Timestamp.fromDate(dateObj),
        imageUrl,
      };
      console.log("Payload to be added to Firestore:", payload);

      // Write to the "MemoryWall" collection
      await addDoc(collection(db, "MemoryWall"), payload);
      console.log("Memory document added successfully.");
      setTitle("");
      setCaption("");
      setDate("");
      setImageFile(null);
      alert("Memory uploaded successfully!");
    } catch (error: unknown) {
      console.error("Error uploading memory:", error);
      if (error instanceof Error) {
        alert("Failed to upload memory: " + error.message);
      } else {
        alert("Failed to upload memory.");
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="max-w-md mx-auto p-8 rounded-lg shadow-lg"
      style={{
        backgroundColor: "var(--neutral)",
        border: "1px solid var(--primary)",
      }}
    >
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--primary)" }}
      >
        Add a New Memory
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Input */}
        <div>
          <label
            htmlFor="date"
            className="block mb-1 font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--primary)",
              color: "var(--foreground)",
            }}
          />
        </div>
        {/* Title Input (Optional) */}
        <div>
          <label
            htmlFor="title"
            className="block mb-1 font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Title (Optional)
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter a title (optional)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--primary)",
              color: "var(--foreground)",
            }}
          />
        </div>
        {/* Caption Input (Optional) */}
        <div>
          <label
            htmlFor="caption"
            className="block mb-1 font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Caption (Optional)
          </label>
          <input
            id="caption"
            type="text"
            placeholder="Write your memory caption (optional)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--primary)",
              color: "var(--foreground)",
            }}
          />
        </div>
        {/* Image Input (GIFs included) */}
        <div>
          <label
            htmlFor="image"
            className="block mb-1 font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Upload Image (GIFs included)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*" // includes gif
            onChange={(e) => {
              if (e.target.files) {
                console.log("Selected file:", e.target.files[0].name);
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded font-semibold"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
          }}
        >
          {loading ? "Uploading..." : "Add Memory"}
        </button>
      </form>
    </div>
  );
}
