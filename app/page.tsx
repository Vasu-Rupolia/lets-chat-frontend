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
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    );

    const socket = socketRef.current;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    socket.on("connect", () => {
      if (user?._id) {
        socket.emit("join", user._id);
      }
    });

    socket.on("user_online", (userId: string) => {
      console.log("ONLINE EVENT:", userId);
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
  useEffect(() => {
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await API.get("/users/list", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Fetched users:", res.data.data);
            setUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    fetchUsers();
    }, []);

  // const sendRequest = async (id: string) => {
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

  //     // Add to sent requests
  //     setSentRequests((prev) => [...prev, id]);

  //   } catch (error: any) {
  //     console.error("Error sending friend request:", error.message);
  //     alert("Failed to send friend request. Please try again.");
  //   }
  // };

  const sendRequest = async (id: string) => {
  try {
    await API.post(
      `/users/friend-request`,
      { receiver: id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    // Update UI instantly
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id
          ? { ...user, hasSentRequest: true }
          : user
      )
    );

  } catch (error) {
    console.error(error);
    alert("Failed to send request");
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((user) => (
              // <div
              //   key={user._id}
              //   className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center"
              // >
              //   <div className="w-14 h-14 rounded-full overflow-hidden mb-3">
              //     <img
              //       src={`http://localhost:5072/uploads/${user.image}`}
              //       alt={user.name}
              //       className="w-full h-full object-cover"
              //     />
              //   </div>

              //   <h2
              //     onClick={() => router.push(`/profile/${user._id}`)}
              //     className="font-semibold text-gray-800 hover:text-red-600 cursor-pointer text-sm"
              //   >
              //     {user.name}
              //   </h2>

              //   <p className="text-xs text-gray-500 mb-3">
              //     {user.email}
              //   </p>

              //   <button
              //     onClick={() => sendRequest(user._id)}
              //     className="bg-red-500 text-white px-3 py-1 text-sm rounded-full hover:bg-red-600 transition"
              //   >
              //     Add Friend
              //   </button>
              // </div>

              // <div
              //   key={user._id}
              //   className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              // >

              //   {/* TOP GRADIENT */}
              //   <div className="h-16 bg-gradient-to-r from-red-100 to-red-700"></div>

              //   {/* CONTENT */}
              //   <div className="px-4 pb-5 text-center -mt-8">

              //     {/* AVATAR */}
              //     <div className="w-16 h-16 mx-auto rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md group-hover:scale-105 transition-transform duration-300">
              //       <img
              //         src={`http://85.121.120.156:5072/uploads/${user.image}`}
              //         alt={user.name}
              //         className="w-full h-full object-cover"
              //       />
              //     </div>

              //     {/* NAME */}
              //     <h2
              //       onClick={() => router.push(`/profile/${user._id}`)}
              //       className="mt-3 font-semibold text-gray-800 cursor-pointer hover:text-red-600 transition"
              //     >
              //       {user.name}
              //     </h2>

              //     {/* EMAIL */}
              //     <p className="text-xs text-gray-500 mb-3">
              //       {user.email}
              //     </p>

              //     {/* BUTTON */}
              //     <button
              //       onClick={() => sendRequest(user._id)}
              //       disabled={user.isFriend || user.hasSentRequest || user.hasReceivedRequest}
              //       className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition
              //         ${
              //           user.isFriend
              //             ? "bg-pink-600 text-white cursor-not-allowed"
              //             : user.hasSentRequest
              //             ? "bg-gray-400 text-white cursor-not-allowed"
              //             : user.hasReceivedRequest
              //             ? "bg-gray-500 text-white cursor-not-allowed"
              //             : "bg-black text-white hover:opacity-90 hover:cursor-pointer"
              //         }
              //       `}
              //     >
              //       {user.isFriend
              //         ? "Friends"
              //         : user.hasSentRequest
              //         ? "Request Sent"
              //         : user.hasReceivedRequest
              //         ? "Request Received"
              //         : "+ Add Friend"}
              //     </button>

              //   </div>
              // </div>

              <div
                key={user._id}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center text-center"
              >
                {/* AVATAR */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-red-400 transition">
                    <img
                      src={`http://85.121.120.156:5072/uploads/${user.image}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* ONLINE DOT */}
                  <span
                    className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                      onlineUsers.includes(user._id!)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                </div>

                {/* NAME */}
                <h2
                  onClick={() => router.push(`/profile/${user._id}`)}
                  className="mt-4 font-semibold text-gray-800 hover:text-red-500 cursor-pointer transition"
                >
                  {user.name}
                </h2>

                {/* EMAIL */}
                <p className="text-xs text-gray-500 mt-1 mb-4 truncate w-full">
                  {user.email}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => sendRequest(user._id)}
                  disabled={user.isFriend || user.hasSentRequest || user.hasReceivedRequest}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      user.isFriend
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : user.hasSentRequest
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : user.hasReceivedRequest
                        ? "bg-yellow-100 text-yellow-700 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02]"
                    }
                  `}
                >
                  {user.isFriend
                    ? "Friends"
                    : user.hasSentRequest
                    ? "Request Sent"
                    : user.hasReceivedRequest
                    ? "Respond"
                    : "+ Add Friend"}
                </button>
              </div>
            ))}
          </div>

        </main>
      </div>
  );
}
