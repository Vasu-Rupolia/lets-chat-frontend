"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  about?: string;
  loading?: boolean;
  onClose: () => void;
  onSave: (about: string) => void;
};

export default function EditAboutModal({
  open,
  about = "",
  loading = false,
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setValue(about || "");
    }
  }, [open, about]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            Edit About
          </h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <label className="mb-2 block text-sm font-medium text-gray-600">
            Tell people about yourself
          </label>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={8}
            maxLength={1000}
            placeholder="Write something about yourself..."
            className="
              w-full
              rounded-2xl
              border
              border-gray-300
              p-4
              outline-none
              resize-none
              focus:border-red-500
              focus:ring-2
              focus:ring-red-300
            "
          />

          <div className="mt-2 text-right text-sm text-gray-500">
            {value.length} / 1000
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              px-6
              py-3
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() => onSave(value.trim())}
            className="
              rounded-xl
              bg-red-500
              px-6
              py-3
              text-white
              transition
              hover:bg-red-600
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}