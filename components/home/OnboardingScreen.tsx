// "use client";

// import { useRouter } from "next/navigation";

// export default function OnboardingScreen() {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <div className="max-w-xl text-center bg-white p-10 rounded-2xl shadow-md">

//         <h1 className="text-3xl font-bold">
//           Welcome to SkillBarter 👋
//         </h1>

//         <p className="mt-3 text-gray-600">
//           Add your skills so we can connect you with people who can help you learn and grow.
//         </p>

//         <div className="mt-6 space-y-3">
//           <button
//             onClick={() => router.push("/profile/skills")}
//             className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600"
//           >
//             ➕ Add Skills You Know
//           </button>

//           <button
//             onClick={() => router.push("/profile/skills")}
//             className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl"
//           >
//             🎯 Add Skills You Want to Learn
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }