"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Toggle between login and sign up mode
  const [isSignUp, setIsSignUp] = useState(false);

  // List of allowed email addresses (lowercase)
  const allowedEmails = ["jkmsoftwaredev@gmail.com", "nyahk.brown@gmail.com"]; // Replace with your emails

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the entered email is allowed (case-insensitive)
    if (!allowedEmails.includes(email.toLowerCase())) {
      alert("Access denied: This email is not authorized.");
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redirect to home page upon successful authentication
      router.push("/");
    } catch (error: unknown) {
      console.error("Authentication error", error);
      if (error instanceof Error) {
        alert("Error: " + error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
    
  };

  return (
    <div
      className="flex flex-col items-center space-y-4 p-4"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <h2 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
        {isSignUp ? "Sign Up" : "Login"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-sm"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input input-bordered"
          style={{
            backgroundColor: "var(--neutral)",
            color: "var(--foreground)",
            borderColor: "var(--primary)",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input input-bordered"
          style={{
            backgroundColor: "var(--neutral)",
            color: "var(--foreground)",
            borderColor: "var(--primary)",
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
          }}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="btn btn-link"
        style={{ color: "var(--primary)" }}
      >
        {isSignUp
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}
