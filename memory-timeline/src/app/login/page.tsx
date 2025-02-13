"use client";

import { auth } from "@/firebase/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Login() {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Signed in successfully!");
      // Optionally redirect the user after sign-in.
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      <button className="btn btn-accent" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}
