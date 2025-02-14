"use client";

import { useState } from "react";
import { db, storage } from "@/firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function MemoryForm() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null); // renamed
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting memory form...");
    setLoading(true);

    try {
      let imageUrl = "";
      if (mediaFile) {
        console.log("Uploading media file:", mediaFile.name);

        // Decide folder based on file type (image vs. video)
        const isVideo = mediaFile.type.startsWith("video/");
        const folderName = isVideo ? "videos" : "images";

        const storageRef = ref(
          storage,
          `${folderName}/${mediaFile.name}_${Date.now()}`
        );
        const snapshot = await uploadBytes(storageRef, mediaFile);
        console.log("Media uploaded, snapshot:", snapshot);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Retrieved media URL:", imageUrl);
      } else {
        console.log("No media file provided.");
      }

      // Ensure date is valid
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date provided.");
      }

      const payload = {
        title,        // optional
        caption,      // optional
        date: Timestamp.fromDate(dateObj),
        imageUrl,     // store imageUrl for both images and videos
      };
      console.log("Payload to be added to Firestore:", payload);
      // Write to the "MemoryWall" collection
      await addDoc(collection(db, "MemoryWall"), payload);
      console.log("Memory document added successfully.");
      setTitle("");
      setCaption("");
      setDate("");
      setMediaFile(null);
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
        {/* Media (Image or Video) Input */}
        <div>
          <label
            htmlFor="media"
            className="block mb-1 font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Upload Media (Image or Video)
          </label>
          <input
            id="media"
            type="file"
            accept="image/*,video/*" // accept both
            onChange={(e) => {
              if (e.target.files) {
                console.log("Selected file:", e.target.files[0].name);
                setMediaFile(e.target.files[0]);
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
