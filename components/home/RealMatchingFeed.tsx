"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RealMatchingFeed({ user }: any) {
  const router = useRouter();
  const [tab, setTab] = useState("learn");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers(tab);
  }, [tab]);

  const fetchUsers = async (type: string) => {
    const res = await API.get("/users", {
      params: { type },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setUsers(res.data.data);
  };

  return (
    <div className="p-6">

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab("learn")}>🎯 Learn</button>
        <button onClick={() => setTab("teach")}>🧑‍🏫 Teach</button>
        <button onClick={() => setTab("mutual")}>🤝 Mutual</button>
      </div>

      {/* Users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((u: any) => (
          <div key={u._id} className="p-4 bg-white rounded-xl shadow">

            <h2
              onClick={() => router.push(`/profile/${u._id}`)}
              className="font-bold cursor-pointer"
            >
              {u.name}
            </h2>

            <p className="text-sm text-gray-500">{u.email}</p>

          </div>
        ))}
      </div>

    </div>
  );
}