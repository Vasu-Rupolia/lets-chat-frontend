// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { User } from "@/types";
// import { dummyUsers } from "@/lib/dummyUsers";
// import API from "@/lib/api";
// import Header from "../components/Header";

// export default function HomePage() {
//   const router = useRouter();

//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//         const token = localStorage.getItem("token");

//         if (!token) {
//             router.push("/login");
//             return;
//         }

//         try {
//             const res = await API.get("/users/list", {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             console.log("Fetched users:", res.data.data);
//             setUsers(res.data.data);
//             setLoading(false);
//         } catch (err) {
//             console.error(err);
//             setLoading(false);
//         }
//     };

//     fetchUsers();
//     }, []);

//   const sendRequest = (id: string) => {
//     alert(`Friend request sent to user ${id} 🚀`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-lg font-semibold">
//         Loading users...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* Header */}
//       <Header />

//       {/* Users */}
//       <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

//         {users.map((user) => (
//           <div
//             key={user._id}
//             className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
//           >

//             <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
//               <img
//                 src={`http://localhost:5072/uploads/${user.image}`}
//                 alt={user.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <h2
//               onClick={() => router.push(`/profile/${user._id}`)}
//               className="font-semibold text-gray-800 hover:text-red-600 cursor-pointer transition"
//             >
//               {user.name}
//             </h2>

//             <p className="text-sm text-gray-500 mb-4">
//               {user.email}
//             </p>

//             <button
//               onClick={() => sendRequest(user._id)}
//               className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 hover:cursor-pointer transition"
//             >
//               Add Friend
//             </button>

//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { User } from "@/types";
// import API from "@/lib/api";
// import { io } from "socket.io-client";

// export default function HomePage() {
  
//   const router = useRouter();

//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sentRequests, setSentRequests] = useState<string[]>([]);
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
//   const [filter, setFilter] = useState("matched");

//   const socketRef = useRef<any>(null);

//   useEffect(() => {
//     socketRef.current = io(
//       process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//     );

//     const socket = socketRef.current;

//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     socket.on("connect", () => {
//       if (user?._id) {
//         socket.emit("join", user._id);
//       }
//     });

//     socket.on("user_online", (userId: string) => {
//       console.log("ONLINE EVENT:", userId);
//       setOnlineUsers((prev) => [...new Set([...prev, userId])]);
//     });

//     socket.on("user_offline", (userId: string) => {
//       setOnlineUsers((prev) => prev.filter((id) => id !== userId));
//     });

//     socket.on("online_users_list", (users: string[]) => {
//       setOnlineUsers(users);
//     });

//     return () => socket.disconnect();
//   }, []);
//   useEffect(() => {
//     const fetchUsers = async (selectedFilter = "matched") => {
//       const token = localStorage.getItem("token");

//       const res = await API.get("/users", {
//         params: { filter: selectedFilter },
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setUsers(res.data.data);
//     };

//     fetchUsers();
//     }, []);

//   // const sendRequest = async (id: string) => {
//   //   try {
//   //     await API.post(
//   //       `/users/friend-request`,
//   //       { receiver: id },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("token")}`
//   //         }
//   //       }
//   //     );

//   //     // Add to sent requests
//   //     setSentRequests((prev) => [...prev, id]);

//   //   } catch (error: any) {
//   //     console.error("Error sending friend request:", error.message);
//   //     alert("Failed to send friend request. Please try again.");
//   //   }
//   // };

//   const sendRequest = async (id: string) => {
//   try {
//     await API.post(
//       `/users/friend-request`,
//       { receiver: id },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       }
//     );

//     // Update UI instantly
//     setUsers((prev) =>
//       prev.map((user) =>
//         user._id === id
//           ? { ...user, hasSentRequest: true }
//           : user
//       )
//     );

//   } catch (error) {
//     console.error(error);
//     alert("Failed to send request");
//   }
// };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-lg font-semibold">
//         Loading users...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">

//         {/* Main Content */}
//         <main className="flex-1 p-4 md:p-6">

//           <div className="flex gap-3 mb-4">
//             <button
//               onClick={() => setFilter("matched")}
//               className={`px-4 py-2 rounded ${
//                 filter === "matched"
//                   ? "bg-red-500 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               Matched
//             </button>

//             <button
//               onClick={() => setFilter("all")}
//               className={`px-4 py-2 rounded ${
//                 filter === "all"
//                   ? "bg-red-500 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               All Users
//             </button>
//           </div>

//           <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {users.map((user) => (
//               // <div
//               //   key={user._id}
//               //   className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center"
//               // >
//               //   <div className="w-14 h-14 rounded-full overflow-hidden mb-3">
//               //     <img
//               //       src={`http://localhost:5072/uploads/${user.image}`}
//               //       alt={user.name}
//               //       className="w-full h-full object-cover"
//               //     />
//               //   </div>

//               //   <h2
//               //     onClick={() => router.push(`/profile/${user._id}`)}
//               //     className="font-semibold text-gray-800 hover:text-red-600 cursor-pointer text-sm"
//               //   >
//               //     {user.name}
//               //   </h2>

//               //   <p className="text-xs text-gray-500 mb-3">
//               //     {user.email}
//               //   </p>

//               //   <button
//               //     onClick={() => sendRequest(user._id)}
//               //     className="bg-red-500 text-white px-3 py-1 text-sm rounded-full hover:bg-red-600 transition"
//               //   >
//               //     Add Friend
//               //   </button>
//               // </div>

//               // <div
//               //   key={user._id}
//               //   className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
//               // >

//               //   {/* TOP GRADIENT */}
//               //   <div className="h-16 bg-gradient-to-r from-red-100 to-red-700"></div>

//               //   {/* CONTENT */}
//               //   <div className="px-4 pb-5 text-center -mt-8">

//               //     {/* AVATAR */}
//               //     <div className="w-16 h-16 mx-auto rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md group-hover:scale-105 transition-transform duration-300">
//               //       <img
//               //         src={`http://85.121.120.156:5072/uploads/${user.image}`}
//               //         alt={user.name}
//               //         className="w-full h-full object-cover"
//               //       />
//               //     </div>

//               //     {/* NAME */}
//               //     <h2
//               //       onClick={() => router.push(`/profile/${user._id}`)}
//               //       className="mt-3 font-semibold text-gray-800 cursor-pointer hover:text-red-600 transition"
//               //     >
//               //       {user.name}
//               //     </h2>

//               //     {/* EMAIL */}
//               //     <p className="text-xs text-gray-500 mb-3">
//               //       {user.email}
//               //     </p>

//               //     {/* BUTTON */}
//               //     <button
//               //       onClick={() => sendRequest(user._id)}
//               //       disabled={user.isFriend || user.hasSentRequest || user.hasReceivedRequest}
//               //       className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition
//               //         ${
//               //           user.isFriend
//               //             ? "bg-pink-600 text-white cursor-not-allowed"
//               //             : user.hasSentRequest
//               //             ? "bg-gray-400 text-white cursor-not-allowed"
//               //             : user.hasReceivedRequest
//               //             ? "bg-gray-500 text-white cursor-not-allowed"
//               //             : "bg-black text-white hover:opacity-90 hover:cursor-pointer"
//               //         }
//               //       `}
//               //     >
//               //       {user.isFriend
//               //         ? "Friends"
//               //         : user.hasSentRequest
//               //         ? "Request Sent"
//               //         : user.hasReceivedRequest
//               //         ? "Request Received"
//               //         : "+ Add Friend"}
//               //     </button>

//               //   </div>
//               // </div>

//               <div
//                 key={user._id}
//                 className="group bg-white rounded-2xl border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center text-center"
//               >
//                 {/* AVATAR */}
//                 <div className="relative">
//                   <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-red-400 transition">
//                     <img
//                       src={`http://85.121.120.156:5072/uploads/${user.image}`}
//                       alt={user.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   {/* ONLINE DOT */}
//                   <span
//                     className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
//                       onlineUsers.includes(user._id!)
//                         ? "bg-green-500"
//                         : "bg-gray-400"
//                     }`}
//                   ></span>
//                 </div>

//                 {/* NAME */}
//                 <h2
//                   onClick={() => router.push(`/profile/${user._id}`)}
//                   className="mt-4 font-semibold text-gray-800 hover:text-red-500 cursor-pointer transition"
//                 >
//                   {user.name}
//                 </h2>

//                 {/* EMAIL */}
//                 <p className="text-xs text-gray-500 mt-1 mb-4 truncate w-full">
//                   {user.email}
//                 </p>

//                 {user.matchPercentage! > 0 && (
//                   <p className="text-xs text-green-600 mt-1">
//                     {user.matchPercentage}% match
//                   </p>
//                 )}

//                 {/* BUTTON */}
//                 <button
//                   onClick={() => sendRequest(user._id)}
//                   disabled={user.isFriend || user.hasSentRequest || user.hasReceivedRequest}
//                   className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
//                     ${
//                       user.isFriend
//                         ? "bg-green-100 text-green-700 cursor-not-allowed"
//                         : user.hasSentRequest
//                         ? "bg-gray-200 text-gray-600 cursor-not-allowed"
//                         : user.hasReceivedRequest
//                         ? "bg-yellow-100 text-yellow-700 cursor-not-allowed"
//                         : "bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02]"
//                     }
//                   `}
//                 >
//                   {user.isFriend
//                     ? "Friends"
//                     : user.hasSentRequest
//                     ? "Request Sent"
//                     : user.hasReceivedRequest
//                     ? "Respond"
//                     : "+ Add Friend"}
//                 </button>
//               </div>
//             ))}
//           </div>

//         </main>
//       </div>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import API from "@/lib/api";
import { io } from "socket.io-client";

export default function HomePage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [filter, setFilter] = useState("matched");

  const socketRef = useRef<any>(null);

  // SOCKET
  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    );

    const socket = socketRef.current;
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    socket.on("connect", () => {
      if (user?._id) socket.emit("join", user._id);
    });

    socket.on("user_online", (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    socket.on("online_users_list", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => socket.disconnect();
  }, []);

  // FETCH USERS
  const fetchUsers = async (selectedFilter = "matched") => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await API.get("/users", {
        params: { filter: selectedFilter },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // 🔥 FIX
    }
  };

  // RUN WHEN FILTER CHANGES
  useEffect(() => {
    fetchUsers(filter);
  }, [filter]);

  // SEND REQUEST
  const sendRequest = async (id: string) => {
    try {
      await API.post(
        `/users/friend-request`,
        { receiver: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, hasSentRequest: true } : user
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to send request");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading users...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">

    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Discover People
        </h1>

        <p className="text-gray-500 mt-2">
          Connect with people who share your skills and interests.
        </p>

      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">

        <button
          onClick={() => setFilter("matched")}
          className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
            filter === "matched"
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
              : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
          }`}
        >
          🎯 Best Matches
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
            filter === "all"
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
              : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
          }`}
        >
          👥 All Users
        </button>

      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

          <div className="text-6xl mb-4">
            🔍
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            No Users Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your filters.
          </p>

        </div>
      )}

      {/* User Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {users.map((user) => (
          <div
            key={user._id}
            className="
              group
              bg-white/80
              backdrop-blur-sm
              rounded-3xl
              border
              border-white
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-2
              transition-all
              duration-300
              overflow-hidden
            "
          >

            {/* Top Gradient */}
            <div className="h-20 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400"></div>

            {/* Avatar */}
            <div className="-mt-10 flex justify-center relative">

              <div className="relative">

                <img
                  src={`https://api.skillbarter.codevocab.com/uploads/${user.image}`}
                  className="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    border-4
                    border-white
                    shadow-lg
                  "
                />

                <span
                  className={`absolute bottom-2 right-1 w-4 h-4 rounded-full border-2 border-white ${
                    onlineUsers.includes(user._id!)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />

              </div>

            </div>

            {/* Content */}
            <div className="p-5 text-center">

              <h2
                onClick={() => router.push(`/profile/${user._id}`)}
                className="
                  text-lg
                  font-bold
                  text-gray-900
                  cursor-pointer
                  hover:text-red-500
                "
              >
                {user.name}
                (
                  {/* Match Badge */}
              {user.matchPercentage! > 0 && (
                <div className="mt-3">

                  <span
                    className="
                      inline-flex
                      items-center
                      bg-green-50
                      text-green-600
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                    "
                  >
                    🎯 {user.matchPercentage}% Match
                  </span>

                </div>
              )}
                )
              </h2>

              <p className="text-sm text-gray-500 truncate mt-1">
                {user.email}
              </p>

              {/* Action Button */}
              <button
                onClick={() => sendRequest(user._id)}
                disabled={
                  user.isFriend ||
                  user.hasSentRequest ||
                  user.hasReceivedRequest
                }
                className={`
                  w-full
                  mt-5
                  py-2.5
                  rounded-xl
                  font-medium
                  transition-all
                  ${
                    user.isFriend
                      ? "bg-green-100 text-green-700"
                      : user.hasSentRequest
                      ? "bg-yellow-100 text-yellow-700"
                      : user.hasReceivedRequest
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg"
                  }
                `}
              >
                {user.isFriend
                  ? "✓ Friends"
                  : user.hasSentRequest
                  ? "⏳ Request Sent"
                  : user.hasReceivedRequest
                  ? "📨 Respond"
                  : "+ Add Friend"}
              </button>

            </div>

          </div>
        ))}

      </div>

    </main>

  </div>
);
}