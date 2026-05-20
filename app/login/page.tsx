"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e?: any) => {
    e?.preventDefault();

    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("userId", JSON.stringify(res.data.user._id));

    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-200 to-red-900">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-xl font-bold text-black mb-6 text-center">
          Login
        </h2>

        <input
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg 
          text-gray-800 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg 
          text-gray-800 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}