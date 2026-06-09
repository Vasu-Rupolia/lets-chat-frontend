"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    mobile_number: "",
    about: "",
    skills: [] as string[],
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({
        ...form,
        image: file,
      });
    }
  };

  // const handleSignup = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     const formData = new FormData();

  //     formData.append("name", form.name);
  //     formData.append("email", form.email);
  //     formData.append("password", form.password);
  //     formData.append("gender", form.gender);
  //     formData.append("dob", form.dob);
  //     formData.append("mobile_number", form.mobile_number);

  //     if (form.image) {
  //       formData.append("image", form.image);
  //     }

  //     await API.post("/auth/signup", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     router.push("/login");
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || "Signup failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      if (!form.name || !form.email || !form.password) {
        setError("Please fill all required fields");
        return;
      }

      if (!form.gender) {
        setError("Please select gender");
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("gender", form.gender);
      formData.append("dob", form.dob);
      formData.append("mobile_number", form.mobile_number);
      formData.append("about", form.about);
      formData.append("skills", JSON.stringify(form.skills));

      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await API.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // router.push("/login");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id);

      router.push("/");
    } catch (err: any) {
      console.log("server error", err.response?.data);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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
  
  return (
  <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-red-50 via-white to-red-100">

    {/* Left Section */}
    <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-12">
      <div className="max-w-xl">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Join
          <span className="block text-red-600">
            Skill Barter
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Exchange skills, connect with talented people,
          build meaningful collaborations and learn something new every day.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-500">100+</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-500">50+</div>
            <div className="text-sm text-gray-600">Skills Available</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-500">24/7</div>
            <div className="text-sm text-gray-600">Networking</div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Section */}
    <div className="flex-1 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white p-8">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Account
          </h2>

          <p className="text-gray-500 mt-2">
            Join the Skill Barter community
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            name="mobile_number"
            placeholder="Mobile Number"
            value={form.mobile_number}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <textarea
            name="about"
            rows={4}
            placeholder="Tell something about yourself..."
            value={form.about}
            onChange={(e) =>
              setForm({ ...form, about: e.target.value })
            }
            className="col-span-1 md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {/* Skills */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="React, Node.js, Laravel..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-800"
              />

              <button
                type="button"
                onClick={addSkill}
                className="bg-red-600 text-white px-5 rounded-xl hover:bg-red-700 transition cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {form.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="col-span-1 md:col-span-2">

            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800"
            />

            {form.image && (
              <div className="mt-4 flex justify-center">
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-red-100"
                />
              </div>
            )}
          </div>

        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-8 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?

          <span
            onClick={() => router.push("/login")}
            className="ml-1 text-red-600 font-medium cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>

      </div>

    </div>
  </div>
);
}