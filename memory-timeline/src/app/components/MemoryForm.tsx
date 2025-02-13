"use client";

import { useState } from "react";
import { db, storage } from "@/firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function MemoryForm() {
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const storageRef = ref(
          storage,
          `images/${imageFile.name}_${Date.now()}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      await addDoc(collection(db, "memories"), {
        caption,
        date: Timestamp.fromDate(new Date(date)),
        imageUrl,
      });
      setCaption("");
      setDate("");
      setImageFile(null);
      alert("Memory uploaded successfully!");
    } catch (error) {
      console.error("Error uploading memory:", error);
      alert("Failed to upload memory.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input input-bordered"
        required
      />
      <input
        type="text"
        placeholder="Write your memory caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="input input-bordered"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
        className="file-input file-input-bordered"
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Uploading..." : "Add Memory"}
      </button>
    </form>
  );
}
