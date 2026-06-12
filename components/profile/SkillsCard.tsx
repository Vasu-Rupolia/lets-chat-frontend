"use client";

import { Pencil, Plus } from "lucide-react";

type Props = {
  title: string;
  skills?: string[];
  isOwner: boolean;
  onEdit?: () => void;
  color?: "red" | "blue";
};

export default function SkillsCard({
  title,
  skills = [],
  isOwner,
  onEdit,
  color = "red",
}: Props) {
  const chipColor =
    color === "red"
      ? "from-red-500 to-pink-500"
      : "from-blue-500 to-cyan-500";

  const emptyIcon =
    color === "red" ? "🎯" : "📚";

  const emptyText =
    color === "red"
      ? "No teaching skills added yet."
      : "No learning goals added yet.";

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 h-full">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        {isOwner && (
          <button
            onClick={onEdit}
            className="
              h-10
              w-10
              rounded-xl
              border
              border-gray-200
              hover:bg-gray-100
              transition
            "
          >
            <Pencil
              size={18}
              className="mx-auto"
            />
          </button>
        )}

      </div>

      {/* Skills */}

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">

          {skills.map((skill, index) => (
            <span
              key={index}
              className={`
                px-4
                py-2
                rounded-full
                text-white
                text-sm
                font-medium
                shadow-md
                bg-gradient-to-r
                ${chipColor}
                hover:scale-105
                transition
                cursor-default
              `}
            >
              {skill}
            </span>
          ))}

          {/* Add Button */}

          {isOwner && (
            <button
              onClick={onEdit}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                border-2
                border-dashed
                border-gray-300
                text-gray-500
                hover:border-red-400
                hover:text-red-500
                transition
              "
            >
              <Plus size={16} />

              Add Skill
            </button>
          )}

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">

          <div className="text-5xl">
            {emptyIcon}
          </div>

          <p className="mt-4 text-gray-500 text-center">
            {emptyText}
          </p>

          {isOwner && (
            <button
              onClick={onEdit}
              className="
                mt-6
                flex
                items-center
                gap-2
                bg-red-500
                hover:bg-red-600
                text-white
                px-5
                py-3
                rounded-xl
                transition
              "
            >
              <Plus size={18} />

              Add First Skill
            </button>
          )}

        </div>
      )}
    </div>
  );
}