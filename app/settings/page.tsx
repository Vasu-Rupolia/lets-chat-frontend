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
    <div className="bg-gray-100 min-h-screen text-gray-900">

      <div className="max-w-3xl mx-auto p-6">

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

          <h2 className="text-xl font-bold mb-6 text-gray-900">
            Settings ⚙️
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 
              focus:border-pink-500 text-gray-900 bg-white"
            />

            {/* Email */}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 
              focus:border-pink-500 text-gray-900 bg-white"
            />

            {/* Mobile */}
            <input
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 
              focus:border-pink-500 text-gray-900 bg-white"
            />

            {/* About */}
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="About"
              className="col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 
              focus:border-pink-500 text-gray-900 bg-white"
            />

            {/* Skills */}
            <div className="col-span-2">

              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-pink-500 
                  focus:border-pink-500 text-gray-900 bg-white"
                />

                <button
                  onClick={addSkill}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-4 rounded-lg"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {form.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-pink-100 text-red-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)}>✕</button>
                  </span>
                ))}
              </div>

            </div>

            {/* Image */}
            <input
              type="file"
              onChange={handleFileChange}
              className="col-span-2 text-gray-700"
            />

          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}