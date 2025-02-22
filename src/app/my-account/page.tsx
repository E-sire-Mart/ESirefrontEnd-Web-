// src/app/my-account/page.tsx

"use client";

import { useAuth } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyAccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return <p>Redirecting to login...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">My Account</h1>
      <p className="mt-4">Welcome, {user.username}!</p>

      <div className="mt-8">
        <h2 className="text-xl">Account Details</h2>
        <ul className="mt-4 space-y-2">
          <li>Email: {user.username}</li>
          <li>Membership: Premium</li>
        </ul>
      </div>

      <button
        onClick={logout}
        className="mt-8 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
