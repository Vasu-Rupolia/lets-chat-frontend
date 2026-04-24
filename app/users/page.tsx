"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { User } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data));
  }, []);

  const sendRequest = async (id: string) => {
    await API.post("/friends/request", { userId: id });
    alert("Request sent");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Users</h2>

      <div className="grid grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>

            <button
              onClick={() => sendRequest(u._id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}