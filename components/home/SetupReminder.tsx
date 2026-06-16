// "use client";

// import { useRouter } from "next/navigation";

// export default function SetupReminder({ user }: any) {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
//       <div className="max-w-xl text-center bg-white p-10 rounded-2xl shadow-md">

//         <h1 className="text-2xl font-bold">
//           Almost Ready 🚀
//         </h1>

//         <p className="mt-3 text-gray-600">
//           Complete your profile to unlock skill matches.
//         </p>

//         <div className="mt-6">
//           <p className="text-sm text-gray-500">
//             You have added some skills, but still missing learning goals.
//           </p>
//         </div>

//         <button
//           onClick={() => router.push("/profile/skills")}
//           className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600"
//         >
//           Complete Setup
//         </button>

//       </div>
//     </div>
//   );
// }