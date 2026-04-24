"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/users/forgot-password", { email });
      alert("Reset link sent!");
    } catch (err:any) {
      alert("Error sending email"+ err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-500 to-red-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-600">Forgot Password</h2>

        <input
          className="w-full mb-4 px-4 py-2 border rounded-lg text-gray-600"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}