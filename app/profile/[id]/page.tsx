"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import API from "@/lib/api";
import { Camera, Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AboutCard from "@/components/profile/AboutCard";
import SkillsCard from "@/components/profile/SkillsCard";
import EditSkillsModal from "@/components/profile/EditSkillsModal";
import EditAboutModal from "@/components/profile/EditAboutModal";
import CropperModal from "@/components/profile/CropperModal";

type User = {
  _id?: string;
  name: string;
  email?: string;
  image?: string;
  dob?: string;
  skills?: string[];
  skillsToLearn: string[];
  about?: string;
};

export default function ProfilePage() {
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [showImageModal, setShowImageModal] = useState(false);

  const [uploading, setUploading] = useState(false);

  // CROP STATES
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showTeachModal, setShowTeachModal] =
  useState(false);

  const [showLearnModal, setShowLearnModal] =
    useState(false);

  const [showAboutModal, setShowAboutModal] =
    useState(false);

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  const loggedInUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};

  const isOwner =
  loggedInUser?._id === user?._id;

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

  // IMAGE SELECT
  const handleImageSelect = async (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // CREATE CROPPED IMAGE
  const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any
): Promise<File | null> => {
  const image = new Image();

  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        const file = new File([blob], "profile.jpg", {
          type: "image/jpeg",
        });

        resolve(file);
      },
      "image/jpeg",
      1
    );
  });
};

  // UPLOAD CROPPED IMAGE
  const handleUploadCroppedImage = async () => {
    try {
      setUploading(true);

      const croppedFile = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );

      if (!croppedFile) return;

      const formData = new FormData();

      formData.append("image", croppedFile);

      const token = localStorage.getItem("token");

      const res = await API.put("/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // setUser((prev: any) => ({
      //   ...prev,
      //   image: res.data.data.image,
      // }));

      const updatedUser = res.data.data;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setShowImageModal(false);

      setSelectedImage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const updateTeachSkills = async (
    skills: string[]
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await API.put(
        "/users/update",
        {
          skills,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev: any) => ({
        ...prev,
        skills,
      }));

      setShowTeachModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateLearnSkills = async (
    skillsToLearn: string[]
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await API.put(
        "/users/update",
        {
          skillsToLearn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev: any) => ({
        ...prev,
        skillsToLearn,
      }));

      setShowLearnModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateAbout = async (
    about: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await API.put(
        "/users/update",
        {
          about,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev: any) => ({
        ...prev,
        about,
      }));

      setShowAboutModal(false);
    } catch (err) {
      console.log(err);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          className="animate-spin text-red-500"
          size={50}
        />
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-red-500">User not found</div>;
  }
//   return (
//   <div className="min-h-screen bg-gray-100">

//     {/* Cover */}
//     <div className="h-72 bg-gradient-to-br from-red-600 via-pink-500 to-orange-400 relative overflow-hidden">
//       <div className="absolute inset-0 bg-black/10" />

//       <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
//     </div>

//     <div className="max-w-6xl mx-auto px-4 md:px-8">

//       {/* Profile Card */}
//       <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 relative -mt-24 border border-white">

//         {/* Avatar */}
//         <div className="absolute left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 -top-20">

//           <div className="relative">

//             <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-xl">

//               {user.image ? (
//                 <img
//                   src={`${IMAGE_BASE_URL}${user.image}?t=${Date.now()}`}
//                   alt={user.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center w-full h-full text-5xl font-bold text-gray-600">
//                   {user.name?.charAt(0)}
//                 </div>
//               )}

//             </div>

//             <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100">

//               {uploading ? (
//                 <Loader2 size={18} className="animate-spin" />
//               ) : (
//                 <Camera size={18} />
//               )}

//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleImageSelect}
//               />
//             </label>

//           </div>

//         </div>

//         {/* Info */}
//         <div className="mt-20 md:mt-0 md:ml-48">

//           <h1 className="text-4xl font-bold text-gray-900">
//             {user.name}
//           </h1>

//           <p className="text-gray-500 mt-2">
//             {user.email}
//           </p>

//           <div className="flex flex-wrap gap-3 mt-4">

//             {user.dob && (
//               <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
//                 {calculateAge(user.dob)} Years
//               </span>
//             )}

//             <span className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
//               Active Member
//             </span>

//           </div>

//         </div>

//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

//         <div className="bg-white rounded-2xl shadow p-5 text-center">
//           <h3 className="text-3xl font-bold text-red-500">
//             {user.skills?.length || 0}
//           </h3>
//           <p className="text-gray-500 text-sm">
//             Skills
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-5 text-center">
//           <h3 className="text-3xl font-bold text-pink-500">
//             12
//           </h3>
//           <p className="text-gray-500 text-sm">
//             Connections
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-5 text-center">
//           <h3 className="text-3xl font-bold text-orange-500">
//             8
//           </h3>
//           <p className="text-gray-500 text-sm">
//             Exchanges
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-5 text-center">
//           <h3 className="text-3xl font-bold text-green-500">
//             ★ 4.8
//           </h3>
//           <p className="text-gray-500 text-sm">
//             Rating
//           </p>
//         </div>

//       </div>

//       {/* Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

//         {/* About */}
//         <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">

//           <h3 className="text-2xl font-bold text-gray-900 mb-4">
//             About
//           </h3>

//           <p className="text-gray-600 leading-8">
//             {user.about || "No bio available."}
//           </p>

//         </div>

//         {/* Skills */}
//         <div className="bg-white rounded-3xl shadow-xl p-8">

//           <h3 className="text-2xl font-bold text-gray-900 mb-4">
//             Skills
//           </h3>

//           {user.skills && user.skills.length > 0 ? (
//             <div className="flex flex-wrap gap-3">

//               {user.skills.map((skill, index) => (
//                 <span
//                   key={index}
//                   className="
//                     bg-gradient-to-r
//                     from-red-500
//                     to-pink-500
//                     text-white
//                     px-4
//                     py-2
//                     rounded-full
//                     text-sm
//                     font-medium
//                     shadow
//                   "
//                 >
//                   {skill}
//                 </span>
//               ))}

//             </div>
//           ) : (
//             <p className="text-gray-500">
//               No skills listed.
//             </p>
//           )}

//         </div>

//       </div>

//     </div>

//     {/* Crop Modal */}
//     {showImageModal && selectedImage && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-4 w-[90%] max-w-lg">
//             <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
//               <Cropper
//                 image={selectedImage}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 cropShape="round"
//                 showGrid={false}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//               />
//             </div>

//             <input
//               type="range"
//               min={1}
//               max={3}
//               step={0.1}
//               value={zoom}
//               onChange={(e: any) => setZoom(e.target.value)}
//               className="w-full mt-4"
//             />

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={() => {
//                   setShowImageModal(false);
//                   setSelectedImage(null);
//                 }}
//                 className="px-4 py-2 rounded bg-gray-200"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleUploadCroppedImage}
//                 className="px-4 py-2 rounded bg-red-500 text-white"
//               >
//                 {uploading ? "Uploading..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
    

//   </div>
// );

  return (
  <>
    <ProfileHeader
      user={user}
      age={calculateAge(user.dob)}
      imageBaseUrl={IMAGE_BASE_URL!}
      uploading={uploading}
      isOwner={isOwner}
      onSelectImage={handleImageSelect}
    />

    <main className="max-w-7xl mx-auto px-5 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="space-y-6">

          <AboutCard
            about={user.about}
            isOwner={isOwner}
            onEdit={() => setShowAboutModal(true)}
          />

        </div>

        {/* RIGHT */}

        <div className="lg:col-span-2 space-y-6">

          <SkillsCard
            title="Skills I Can Teach"
            skills={user.skills}
            color="red"
            isOwner={isOwner}
            onEdit={() => setShowTeachModal(true)}
          />

          <SkillsCard
            title="Skills I Want To Learn"
            skills={user.skillsToLearn}
            color="blue"
            isOwner={isOwner}
            onEdit={() => setShowLearnModal(true)}
          />

        </div>

      </div>

    </main>

    {/* Teach Modal */}

    <EditSkillsModal
      open={showTeachModal}
      title="Skills I Can Teach"
      initialSkills={user.skills || []}
      onClose={() => setShowTeachModal(false)}
      onSave={updateTeachSkills}
    />

    {/* Learn Modal */}

    <EditSkillsModal
      open={showLearnModal}
      title="Skills I Want To Learn"
      initialSkills={user.skillsToLearn || []}
      onClose={() => setShowLearnModal(false)}
      onSave={updateLearnSkills}
    />

    {/* About Modal */}

    <EditAboutModal
      open={showAboutModal}
      about={user.about}
      onClose={() => setShowAboutModal(false)}
      onSave={updateAbout}
    />

    {/* Cropper Modal */}

    {showImageModal && (
      // <CropperModal />
      <CropperModal
        open={showImageModal}
        image={selectedImage}
        crop={crop}
        zoom={zoom}
        loading={uploading}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={() => {
          setShowImageModal(false);
          setSelectedImage(null);
        }}
        onSave={handleUploadCroppedImage}
      />
    )}
  </>
);
}