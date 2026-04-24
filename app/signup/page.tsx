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

      await API.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/login");
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
  
  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-red-600">

  //     <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

  //       <h2 className="text-2xl text-gray-800 font-bold text-center mb-6">
  //         Create Account 🚀
  //       </h2>

  //       {error && (
  //         <p className="text-red-500 text-sm mb-3">{error}</p>
  //       )}

  //       {/* Name */}
  //       <input
  //       type="text"
  //       name="name"
  //       placeholder="Full Name"
  //       className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg 
  //       text-gray-800 placeholder-gray-500
  //       focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
  //       value={form.name}
  //       onChange={handleChange}
  //       />

  //       <input
  //         type="email"
  //         name="email"
  //         placeholder="Email"
  //         className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg 
  //         text-gray-800 placeholder-gray-500
  //         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
  //         value={form.email}
  //         onChange={handleChange}
  //       />

  //       <input
  //         type="password"
  //         name="password"
  //         placeholder="Password"
  //         className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg 
  //         text-gray-800 placeholder-gray-500
  //         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
  //         value={form.password}
  //         onChange={handleChange}
  //       />

  //       <input
  //         type="text"
  //         name="mobile_number"
  //         placeholder="Mobile Number"
  //         className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg 
  //         text-gray-800 placeholder-gray-500
  //         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
  //         value={form.mobile_number}
  //         onChange={handleChange}
  //       />

  //       <input
  //         type="date"
  //         name="dob"
  //         value={form.dob}
  //         onChange={handleChange}
  //         className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
  //       />

  //       <select
  //         name="gender"
  //         value={form.gender}
  //         onChange={handleChange}
  //         className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
  //       >
  //         <option value="">Select Gender</option>
  //         <option value="male">Male</option>
  //         <option value="female">Female</option>
  //         <option value="other">Other</option>
  //       </select>

  //       <input
  //         type="file"
  //         accept="image/*"
  //         name="image"
  //         onChange={handleFileChange}
  //         className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg 
  //         text-gray-800 placeholder-gray-500
  //         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
  //       />

  //       {/* Button */}
  //       <button
  //         onClick={handleSignup}
  //         disabled={loading}
  //         className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
  //       >
  //         {loading ? "Creating..." : "Sign Up"}
  //       </button>

  //       {/* Footer */}
  //       <p className="text-sm text-center mt-4 text-gray-800">
  //         Already have an account?{" "}
  //         <span
  //           className="text-pink-500 cursor-pointer hover:underline"
  //           onClick={() => router.push("/login")}
  //         >
  //           Login
  //         </span>
  //       </p>

  //     </div>
  //   </div>
  // );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-200 to-red-900 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">

        <h2 className="text-2xl text-gray-800 font-bold text-center mb-6">
          Create Account 🚀
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-pink-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-pink-500"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-pink-500"
          />

          {/* Mobile */}
          <input
            type="text"
            name="mobile_number"
            placeholder="Mobile Number"
            value={form.mobile_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-pink-500"
          />

          {/* DOB */}
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
          />

          {/* Gender */}
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* About (Full Width) */}
          <textarea
            name="about"
            placeholder="Tell something about yourself..."
            value={form.about}
            onChange={(e) =>
              setForm({ ...form, about: e.target.value })
            }
            className="col-span-1 md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-pink-500"
          />

          {/* Skills */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Skills
            </label>

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Enter skill (e.g. React)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg"
              />

              <button
                type="button"
                onClick={addSkill}
                className="bg-red-500 text-white px-4 rounded-lg hover:bg-pink-600 hover:cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {form.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
            className="col-span-1 md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
          />

        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-pink-600 hover:cursor-pointer transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-800">
          Already have an account?{" "}
          <span
            className="text-red-500 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}