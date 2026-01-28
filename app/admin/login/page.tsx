"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border border-[#1E293B] p-6 rounded-lg">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          className="w-full mb-3 p-2 rounded bg-transparent border border-[#1E293B]"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 rounded bg-transparent border border-[#1E293B]"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[var(--primary)] py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
