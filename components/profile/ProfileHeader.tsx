"use client";

import { Camera, Loader2, Pencil } from "lucide-react";

type Props = {
  user: any;
  age: number | null;
  imageBaseUrl: string;
  isOwner: boolean;
  uploading: boolean;
  onSelectImage: (e: any) => void;
};

export default function ProfileHeader({
  user,
  age,
  imageBaseUrl,
  isOwner,
  uploading,
  onSelectImage,
}: Props) {
  return (
    <>
      {/* Cover */}

      <div className="relative h-72 overflow-hidden rounded-b-[40px] bg-gradient-to-r from-red-600 via-pink-500 to-orange-400">

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      </div>

      <div className="max-w-6xl mx-auto px-5">

        <div className="bg-white rounded-3xl shadow-xl -mt-24 p-8 relative">

          <div className="flex flex-col md:flex-row gap-8">

            {/* Avatar */}

            <div className="relative">

              <div className="w-40 h-40 rounded-full overflow-hidden border-[5px] border-white shadow-xl bg-gray-200">

                {user.image ? (
                  <img
                    src={`${imageBaseUrl}${user.image}?t=${Date.now()}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center h-full text-6xl font-bold text-gray-500">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>

              {isOwner && (
                <label className="absolute bottom-3 right-3 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:scale-105 transition">

                  {uploading ? (
                    <Loader2
                      className="animate-spin"
                      size={18}
                    />
                  ) : (
                    <Camera size={18} />
                  )}

                  <input
                    hidden
                    type="file"
                    onChange={onSelectImage}
                  />

                </label>
              )}
            </div>

            {/* User Info */}

            <div className="flex-1">

              <div className="flex justify-between">

                <div>

                  <h1 className="text-4xl font-bold">
                    {user.name}
                  </h1>

                  <p className="text-gray-500 mt-2">
                    {user.email}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">

                    {age && (
                      <span className="px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                        {age} Years
                      </span>
                    )}

                    <span className="px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                      Active Member
                    </span>

                  </div>

                </div>

                {isOwner && (
                  <button className="h-11 w-11 rounded-xl border hover:bg-gray-100">

                    <Pencil
                      size={18}
                      className="mx-auto"
                    />

                  </button>
                )}

              </div>

              {/* Stats */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                <div className="bg-gray-50 rounded-2xl p-4 text-center">

                  <h2 className="text-3xl font-bold text-red-500">
                    {user.skills?.length || 0}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Teach
                  </p>

                </div>

                <div className="bg-gray-50 rounded-2xl p-4 text-center">

                  <h2 className="text-3xl font-bold text-pink-500">
                    {user.skillsToLearn?.length || 0}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Learning
                  </p>

                </div>

                <div className="bg-gray-50 rounded-2xl p-4 text-center">

                  <h2 className="text-3xl font-bold text-orange-500">
                    18
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Connections
                  </p>

                </div>

                <div className="bg-gray-50 rounded-2xl p-4 text-center">

                  <h2 className="text-3xl font-bold text-green-500">
                    ★4.8
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Rating
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}