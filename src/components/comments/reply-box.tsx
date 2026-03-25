"use client";

import { useState } from "react";
import { Camera, Smile, Send, Pencil } from "lucide-react";
import { CommentUser } from "./types";

interface ReplyBoxProps {
  mentionName?: string;
  onCancel: () => void;
  onSend: (text: string) => void;
  currentUser: CommentUser;
}

export default function ReplyBox({
  mentionName,
  onCancel,
  onSend,
  currentUser,
}: ReplyBoxProps) {
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <div className="flex gap-2 items-start">
      <img
        src={currentUser.avatar}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-x-1 mb-1">
          <span className="font-bold text-[13px] text-black">
            {currentUser.name}
          </span>
          {mentionName && (
            <>
              <span className="text-gray-400 text-[12px]">·</span>
              <Pencil size={11} className="text-blue-600" strokeWidth={2} />
              <span className="text-blue-600 font-semibold text-[12px]">
                Author
              </span>
            </>
          )}
        </div>

        {mentionName && (
          <div className="flex items-center flex-wrap gap-x-1 mb-2">
            <span className="text-[13px] text-black font-semibold">
              Replying to
            </span>
            <span className="text-[13px] font-bold text-black">
              {mentionName}
            </span>
            <span className="text-gray-400 text-[12px]">·</span>
            <button
              className="text-[13px] text-gray-600 font-bold"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-2xl px-3 py-2.5 flex-1 max-w-50">
            {mentionName && (
              <div className="inline-flex items-center text-blue-500 text-[13px] font-bold mb-1.5">
                {mentionName}
              </div>
            )}
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={mentionName ? "Write a reply…" : "Write a comment…"}
              className="w-full text-[13px] text-black bg-transparent outline-none placeholder-gray-400 mb-2"
            />
            <div className="flex items-center justify-end gap-3">
              <button className="text-gray-500 hover:text-gray-700">
                <Camera size={18} strokeWidth={1.8} />
              </button>
              <button className="border border-gray-400 rounded px-1 py-0.5 text-[10px] font-bold text-gray-500 leading-none tracking-wide">
                GIF
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Smile size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            className={`flex items-center justify-center transition-colors ${text.trim() ? "text-blue-500 hover:text-blue-600" : "text-gray-300"}`}
          >
            <Send size={18} strokeWidth={1.8} className="rotate-45" />
          </button>
        </div>

        {!mentionName && (
          <button
            className="text-[12px] text-gray-500 mt-1.5 pl-1"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
