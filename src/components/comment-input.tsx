"use client";

import { useState, useEffect } from "react";
import { Camera, Smile } from "lucide-react";
import SendIcon from "@/assets/icons/send-svgrepo-com";
import GifIcon from "@/assets/icons/gif";
import { getCachedUserDetails, CachedUserDetails } from "@/utils/user-cache";

interface CommentInputProps {
  postId: string;
  onComment: (postId: string, text: string) => Promise<void>;
}

export default function CommentInput({ postId, onComment }: CommentInputProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<CachedUserDetails | null>(
    null,
  );

  useEffect(() => {
    const initializeUser = async () => {
      const userDetails = await getCachedUserDetails();
      setCurrentUser(userDetails);
    };

    initializeUser();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key?.startsWith("userDetails_")) {
        initializeUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onComment(postId, text.trim());
      setText("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-3 py-3 flex items-center gap-2">
      {currentUser && (
        <img
          src={currentUser.avatar}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          alt={currentUser.name}
        />
      )}
      <div className="flex-1 bg-[rgb(235,235,235)] rounded-2xl px-1 py-2.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 relative">
          {!text && (
            <span className="absolute left-0 right-[80px] pointer-events-none text-[14px] font-bold text-text-secondary truncate">
              Comment as{" "}
              <span className="font-bold text-black">{currentUser?.name}</span>
            </span>
          )}
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 500))}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="flex-1 min-w-[60px] text-[13px] text-black bg-transparent outline-none"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="text-gray-500 hover:text-gray-700">
              <Camera size={22} strokeWidth={2} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <GifIcon />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Smile size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isSubmitting}
        className={`flex-shrink-0 ${text.trim() ? "text-blue-500" : "text-gray-300"}`}
      >
        <SendIcon size={26} color="#0064FF" />
      </button>
    </div>
  );
}
