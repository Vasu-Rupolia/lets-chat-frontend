"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  initialSkills: string[];
  loading?: boolean;
  onClose: () => void;
  onSave: (skills: string[]) => void;
};

export default function EditSkillsModal({
  open,
  title,
  initialSkills,
  loading = false,
  onClose,
  onSave,
}: Props) {
  const [skills, setSkills] = useState<string[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setSkills(initialSkills || []);
    }
  }, [open, initialSkills]);

  if (!open) return null;

  const addSkill = () => {
    const skill = value.trim();

    if (!skill) return;

    if (
      skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setValue("");
      return;
    }

    setSkills([...skills, skill]);
    setValue("");
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5">

      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100 transition"
          >
            <X className="mx-auto" />
          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <label className="text-sm font-medium text-gray-600">
            Add Skill
          </label>

          <div className="flex gap-3 mt-2">

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="React, Flutter, Docker..."
              className="
                flex-1
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-red-400
              "
            />

            <button
              onClick={addSkill}
              className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-5
                rounded-xl
                flex
                items-center
                gap-2
              "
            >
              <Plus size={18} />
              Add
            </button>

          </div>

          {/* Skills */}

          <div className="flex flex-wrap gap-3 mt-8">

            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-2
                    bg-gradient-to-r
                    from-red-500
                    to-pink-500
                    text-white
                    px-4
                    py-2
                    rounded-full
                    shadow
                  "
                >
                  <span>{skill}</span>

                  <button
                    onClick={() => removeSkill(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="w-full py-10 text-center text-gray-500">

                No skills added yet.

              </div>
            )}

          </div>

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              px-6
              py-3
              rounded-xl
              border
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() => onSave(skills)}
            className="
              px-6
              py-3
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

      </div>

    </div>
  );
}