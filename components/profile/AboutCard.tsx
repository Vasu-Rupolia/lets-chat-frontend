"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

type Props = {
  about?: string;
  isOwner: boolean;
  onEdit?: () => void;
};

export default function AboutCard({
  about,
  isOwner,
  onEdit,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const text = about || "";

  const shouldTrim = text.length > 250;

  const displayText =
    expanded || !shouldTrim
      ? text
      : text.slice(0, 250) + "...";

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-bold text-gray-900">
          About
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

      {/* Content */}

      {text ? (
        <>
          <p className="text-gray-600 leading-8 whitespace-pre-line">
            {displayText}
          </p>

          {shouldTrim && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="
                mt-5
                text-red-500
                font-semibold
                hover:text-red-600
              "
            >
              {expanded
                ? "Read Less"
                : "Read More"}
            </button>
          )}
        </>
      ) : (
        <div className="py-12 text-center">

          <div className="text-5xl mb-4">
            📝
          </div>

          <p className="text-gray-500">
            {isOwner
              ? "Tell people about yourself."
              : "No bio added yet."}
          </p>

        </div>
      )}

    </div>
  );
}