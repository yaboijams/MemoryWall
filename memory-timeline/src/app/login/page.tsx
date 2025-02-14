"use client";

import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Toggle between login and sign up mode
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Sign up successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
    } catch (error: any) {
      console.error("Authentication error", error);
      alert("Error: " + error.message);
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
