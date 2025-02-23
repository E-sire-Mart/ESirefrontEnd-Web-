// src/app/signup/page.tsx

"use client"

import { useState } from "react";
import { useAuth } from "../../context/auth-context";

export default function SignupPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      username: email,
      avatar_url: ""
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Sign Up</h1>
      <form onSubmit={handleSignup} className="mt-4">
        <div className="mb-4">
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
