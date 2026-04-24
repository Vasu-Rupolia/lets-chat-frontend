"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import API from "@/lib/api";
import { useParams } from "next/navigation";
import { Message } from "@/types";

export default function ChatPage() {
  const params = useParams();
  const id = params?.id as string;

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!id) return;

    socket.emit("join", id);

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    API.get(`/messages/${id}`).then((res) => {
      setMessages(res.data);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [id]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg: Message = {
      message,
      receiver: id,
      self: true,
    };

    socket.emit("send_message", msg);

    setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-3/4">

        {/* Header */}
        <div className="bg-white p-4 border-b shadow-sm">
          <h2 className="font-semibold text-lg">Chat</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.self ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${
                  m.self
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-800 border"
                }`}
              >
                {m.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            placeholder="Type a message..."
          />

          <button
            onClick={sendMessage}
            className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}