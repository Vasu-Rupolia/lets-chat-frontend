"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

type Friend = {
  _id: string;
  name: string;
  email?: string;
  image?: string;
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await API.get("/users/friends", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFriends(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading friends...</div>;
  }

  return (
  <div className="min-h-screen bg-gray-100">

    {/* Cover */}
    <div className="h-56 bg-gradient-to-br from-red-600 via-pink-500 to-orange-400"></div>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16">

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Friends
            </h1>

            <p className="text-gray-500 mt-1">
              {friends.length} {friends.length === 1 ? "friend" : "friends"}
            </p>
          </div>

          <div className="bg-indigo-50 px-4 py-2 rounded-xl">
            <span className="text-indigo-600 font-semibold">
              👥 Friends Network
            </span>
          </div>
        </div>
      </div>

      {friends.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="text-6xl mb-3">👋</div>

          <h2 className="text-xl font-semibold text-gray-800">
            No friends yet
          </h2>

          <p className="text-gray-500 mt-2">
            Start connecting with people and build your network.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => router.push(`/profile/${friend._id}`)}
              className="
                bg-white
                rounded-2xl
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                cursor-pointer
                overflow-hidden
                group
              "
            >
              {/* Mini Cover */}
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

              <div className="px-5 pb-5">

                {/* Avatar */}
                <div className="-mt-10 mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                    {friend.image ? (
                      <img
                        src={`${IMAGE_BASE_URL}${friend.image}`}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                        {friend.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {friend.name}
                </h2>

                <p className="text-sm text-gray-500 truncate mt-1">
                  {friend.email || "No email available"}
                </p>

                {/* Button */}
                <button
                  className="
                    w-full
                    mt-4
                    py-2.5
                    rounded-xl
                    bg-indigo-600
                    text-white
                    font-medium
                    group-hover:bg-indigo-700
                    transition
                  "
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  </div>
);
}