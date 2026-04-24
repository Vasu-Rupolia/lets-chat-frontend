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
  <div className="bg-gray-100 min-h-screen">

    {/* COVER */}
    <div className="h-40 bg-gradient-to-r from-red-500 to-pink-600"></div>

    <div className="max-w-4xl mx-auto px-6">

      <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-600">
        My Friends ({friends.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {friends.length === 0 ? (
          <p className="text-gray-500 col-span-full text-gray-600">No friends yet.</p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend._id}
              className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
              onClick={() => router.push(`/profile/${friend._id}`)}
            >
              {/* AVATAR */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                {friend.image ? (
                  <img
                    src={`${IMAGE_BASE_URL}${friend.image}`}
                    alt={friend.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-600">
                    {friend.name?.charAt(0)}
                  </span>
                )}
              </div>

              {/* INFO */}
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {friend.name}
                </h2>

                <p className="text-xs text-gray-500 truncate">
                  {friend.email || "No email"}
                </p>
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  </div>
);
}