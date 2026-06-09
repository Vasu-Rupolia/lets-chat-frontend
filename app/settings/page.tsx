"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    about: "",
    skills: [] as string[],
    image: null as File | null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;

        setForm({
          name: user.name || "",
          email: user.email || "",
          mobile_number: user.mobile_number || "",
          about: user.about || "",
          skills: user.skills || [],
          image: null,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (!form.skills.includes(skillInput.toLowerCase())) {
      setForm({
        ...form,
        skills: [...form.skills, skillInput.toLowerCase()],
      });
    }

    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setForm({
      ...form,
      skills: form.skills.filter((s) => s !== skill),
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("mobile_number", form.mobile_number);
      formData.append("about", form.about);
      formData.append("skills", JSON.stringify(form.skills));

      if (form.image) {
        formData.append("image", form.image);
      }

      await API.put("/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully 🚀");

    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">

    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 p-8 text-white mb-8">

        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>

        <div className="relative">
          <h1 className="text-4xl font-bold">
            Account Settings
          </h1>

          <p className="mt-2 text-white/90">
            Manage your profile information and skills.
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* PROFILE PREVIEW */}
        <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">

          <div className="flex flex-col items-center">

            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-100 shadow-lg">

              {form.image ? (
                <img
                  src={URL.createObjectURL(form.image)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                  {form.name?.charAt(0) || "U"}
                </div>
              )}

            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {form.name || "Your Name"}
            </h2>

            <p className="text-gray-500 text-sm">
              {form.email || "your@email.com"}
            </p>

          </div>

          <div className="mt-6">

            <h3 className="font-semibold text-gray-800 mb-3">
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">

              {form.skills.length > 0 ? (
                form.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No skills added
                </p>
              )}

            </div>

          </div>

        </div>

        {/* SETTINGS FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Mobile Number
              </label>

              <input
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Profile Photo
              </label>

              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl text-gray-700"
              />
            </div>

          </div>

          {/* ABOUT */}
          <div className="mt-5">

            <label className="text-sm font-medium text-gray-600">
              About Yourself
            </label>

            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 text-gray-900"
            />

          </div>

          {/* SKILLS */}
          <div className="mt-5">

            <label className="text-sm font-medium text-gray-600">
              Skills
            </label>

            <div className="flex gap-2 mt-2">

              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="React, Node.js, Laravel..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 text-gray-900"
              />

              <button
                onClick={addSkill}
                className="px-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition"
              >
                Add
              </button>

            </div>

            <div className="flex flex-wrap gap-2 mt-4">

              {form.skills.map((skill, i) => (
                <span
                  key={i}
                  className="
                    flex items-center gap-2
                    bg-red-100
                    text-red-700
                    px-3 py-2
                    rounded-full
                    text-sm
                  "
                >
                  {skill}

                  <button
                    onClick={() => removeSkill(skill)}
                    className="font-bold"
                  >
                    ×
                  </button>

                </span>
              ))}

            </div>

          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="
              w-full
              mt-8
              py-4
              rounded-2xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-red-500
              to-pink-500
              hover:shadow-xl
              transition-all
              duration-300
            "
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>

  </div>
);
}