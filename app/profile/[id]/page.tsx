"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import Header from "@/components/Header";

type User = {
  _id?: string;
  name: string;
  email?: string;
  image?: string;
  dob?: string;
  skills?: string[];
  about?: string;
};

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const calculateAge = (dob?: string) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
 };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">User not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* COVER */}
      <div className="h-40 bg-gradient-to-r from-red-500 to-pink-600"></div>

      {/* PROFILE CARD */}
      <div className="max-w-4xl mx-auto px-6">

        <div className="bg-white rounded-xl shadow-md p-6 relative -mt-16">

          {/* AVATAR */}
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              {user.image ? (
                <img
                  src={`${IMAGE_BASE_URL}${user.image}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-gray-600">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* USER INFO */}
          <div className="ml-32">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name}
            </h2>

            <p className="text-gray-600 mt-1">
              {user.email}
            </p>

            {user.dob && (
                <p className="text-gray-700 mt-1 text-sm">
                    Age: {calculateAge(user.dob)} years
                </p>
            )}
          </div>

        </div>

        {/* EXTRA SECTION (future use) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-xl shadow md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
                {user.about || "No bio available."}
            </p>
         </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">Skills</h3>

            {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                    <span
                    key={index}
                    className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full"
                    >
                    {skill}
                    </span>
                ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No skills listed.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}