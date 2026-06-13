"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RealMatchingFeed() {
  const router = useRouter();
  const [tab, setTab] = useState("learn");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers(tab);
  }, [tab]);

  const fetchUsers = async (type: string) => {
    const res = await API.get("/users", {
      params: { filter: type },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setUsers(res.data.data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("learn")}
          className={`px-4 py-2 rounded-full text-sm ${
            tab === "learn" ? "bg-black text-white" : "bg-white"
          }`}
        >
          🎯 Learn
        </button>

        <button
          onClick={() => setTab("teach")}
          className={`px-4 py-2 rounded-full text-sm ${
            tab === "teach" ? "bg-black text-white" : "bg-white"
          }`}
        >
          🧑‍🏫 Teach
        </button>

        <button
          onClick={() => setTab("mutual")}
          className={`px-4 py-2 rounded-full text-sm ${
            tab === "mutual" ? "bg-black text-white" : "bg-white"
          }`}
        >
          🤝 Mutual
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {users.map((u: any) => (
          <div
            key={u._id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={
                  u.profilePic ||
                  "https://ui-avatars.com/api/?name=" + u.name
                }
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <h2
                  onClick={() => router.push(`/profile/${u._id}`)}
                  className="font-semibold cursor-pointer hover:underline"
                >
                  {u.name}
                </h2>

                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
            </div>

            {/* Skills they can teach */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">
                Can Teach
              </p>

              <div className="flex flex-wrap gap-1">
                {(u.skills || []).slice(0, 4).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills they want to learn */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">
                Wants to Learn
              </p>

              <div className="flex flex-wrap gap-1">
                {(u.skillsToLearn || []).slice(0, 4).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <button className="w-full mt-2 bg-black text-white text-sm py-2 rounded-xl hover:opacity-80">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}