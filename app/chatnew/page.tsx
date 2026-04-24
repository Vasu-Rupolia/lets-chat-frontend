"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import { io } from "socket.io-client";

type Conversation = {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  lastMessage?: string;
};

type Friend = {
  _id: string;
  name: string;
  image?: string;
};

type Message = {
  _id?: string;
  text: string;
  sender: string;
  conversationId?: string;
};

type TypingPayload = {
  sender: string;
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout = useRef<any>(null);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("user_online", (userId: string) => {
        setOnlineUsers((prev) => [...prev, userId]);
    });

    socketRef.current.on("user_offline", (userId: string) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
        socketRef.current.off("user_online");
        socketRef.current.off("user_offline");
    };
  }, []);

  // 🔥 Load token + user
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setToken(storedToken);
    setCurrentUserId(user?._id || null);
  }, []);

  // 🔥 CONNECT SOCKET
  useEffect(() => {
    if (!currentUserId) return;

    socketRef.current = io("http://85.121.120.156:5072");

    socketRef.current.emit("join", currentUserId);

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUserId]);

  // 🔥 LISTEN REAL-TIME MESSAGES
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("receive_message", (msg: Message) => {
      // update messages (only if chat open)
      if (msg.conversationId === selectedChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }

      // update sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversationId
            ? { ...c, lastMessage: msg.text }
            : c
        )
      );
    });

    return () => {
      socketRef.current.off("receive_message");
    };
  }, [selectedChat]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("typing", ({ sender }: TypingPayload) => {
      if (sender === selectedChat?.user._id) {
        setIsTyping(true);
      }
    });

    socketRef.current.on("stop_typing", ({ sender }: TypingPayload) => {
      if (sender === selectedChat?.user._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socketRef.current.off("typing");
      socketRef.current.off("stop_typing");
    };
  }, [selectedChat]);

  // 🔥 Fetch conversations + friends
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [convRes, friendRes] = await Promise.all([
          API.get("/chat/conversations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/users/friends", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setConversations(convRes.data);
        setFriends(friendRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // 🔥 Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Open chat
  const openChat = async (chat: Conversation) => {
    setSelectedChat(chat);

    try {
      const res = await API.get(`/chat/messages/${chat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Start chat
  const startChat = async (friend: Friend) => {
    try {
      const res = await API.post(
        "/chat/conversations",
        { receiverId: friend._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const existing = conversations.find(
        (c) => c._id === res.data._id
      );

      if (existing) {
        openChat(existing);
        return;
      }

      const newChat: Conversation = {
        _id: res.data._id,
        user: friend,
        lastMessage: "",
      };

      setConversations((prev) => [newChat, ...prev]);
      openChat(newChat);

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Send message (API only)
  const sendMessage = async () => {
    if (!input.trim() || !selectedChat || !token) return;

    try {
      await API.post(
        "/chat/messages",
        {
          conversationId: selectedChat._id,
          text: input,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInput(""); // no manual push

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r overflow-y-auto">

        <h1 className="p-4 font-bold text-lg border-b text-gray-600">
          Chats
        </h1>

        {/* EXISTING CHATS */}
        {conversations.map((chat) => (
          <div
            key={chat._id}
            onClick={() => openChat(chat)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
              selectedChat?._id === chat._id ? "bg-red-200" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {chat.user.image ? (
                <img
                  src={`${IMAGE_BASE_URL}${chat.user.image}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm font-bold text-gray-600">
                  {chat.user.name.charAt(0)}
                </div>
              )}
              {onlineUsers.includes(chat.user._id) && (
                <span className="text-green-500 text-xs">●</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-600">
                {chat.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {chat.lastMessage || "Start conversation"}
              </p>
            </div>
          </div>
        ))}

        {/* NEW CHAT */}
        <div className="p-3 text-xs text-gray-500 border-t">
          Start new chat
        </div>

        {friends.map((friend) => (
          <div
            key={friend._id}
            onClick={() => startChat(friend)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {friend.image ? (
                <img
                  src={`${IMAGE_BASE_URL}${friend.image}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm font-bold text-gray-600">
                  {friend.name.charAt(0)}
                </div>
              )}
              
            </div>

            <p className="text-sm text-gray-600">{friend.name}</p>
          </div>
        ))}
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col">

        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            Select a chat
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                {selectedChat.user.image && (
                  <img
                    src={`${IMAGE_BASE_URL}${selectedChat.user.image}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <h2 className="font-semibold text-gray-700">
                {selectedChat.user.name}
              </h2>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={msg._id || i}
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm text-gray-600 ${
                    msg.sender === currentUserId
                      ? "ml-auto bg-red-200"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

              {isTyping && (
                <div className="text-xs text-gray-500 px-2">
                  {selectedChat.user.name} is typing...
                </div>
              )}

            {/* INPUT */}
            <div className="p-3 bg-white border-t flex gap-2">
              <input
                value={input}
                // onChange={(e) => setInput(e.target.value)}/
                onChange={(e) => {
                  setInput(e.target.value);

                  if (!socketRef.current || !selectedChat || !currentUserId) return;

                  socketRef.current.emit("typing", {
                    sender: currentUserId,
                    receiver: selectedChat.user._id,
                  });

                  // stop typing after delay
                  if (typingTimeout.current) clearTimeout(typingTimeout.current);

                  typingTimeout.current = setTimeout(() => {
                    socketRef.current.emit("stop_typing", {
                      sender: currentUserId,
                      receiver: selectedChat.user._id,
                    });
                  }, 800);
                }}
                className="flex-1 border rounded-full px-4 py-2 text-sm text-gray-600"
                placeholder="Type message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
